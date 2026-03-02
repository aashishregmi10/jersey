import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ── Constants ── */
const JERSEY_FONT = "Impact, 'Arial Black', Haettenschweiler, sans-serif";
const CIRC_SEGS = 48; // circumferential segments for smooth curves

/* ──────────────────────────────────────────────
   Body cross-section profile (bottom → top)
   29 rings for smooth silhouette
   rx = half-width  |  rz = half-depth (front-to-back)
   ────────────────────────────────────────────── */
const PROFILE = [
  // HEM (slight flare outward)
  { y: -0.70, rx: 0.44, rz: 0.25 },
  { y: -0.68, rx: 0.44, rz: 0.25 },
  { y: -0.62, rx: 0.435, rz: 0.245 },
  { y: -0.54, rx: 0.43, rz: 0.24 },
  // LOWER TORSO
  { y: -0.44, rx: 0.42, rz: 0.235 },
  { y: -0.34, rx: 0.40, rz: 0.225 },
  // WAIST (narrowest)
  { y: -0.24, rx: 0.38, rz: 0.215 },
  { y: -0.14, rx: 0.375, rz: 0.21 },
  // MIDRIFF
  { y: -0.04, rx: 0.38, rz: 0.215 },
  { y: 0.04, rx: 0.395, rz: 0.225 },
  // CHEST
  { y: 0.12, rx: 0.42, rz: 0.24 },
  { y: 0.18, rx: 0.44, rz: 0.25 },
  { y: 0.24, rx: 0.46, rz: 0.26 },
  { y: 0.28, rx: 0.475, rz: 0.265 },
  // UPPER CHEST / ARMPIT
  { y: 0.32, rx: 0.49, rz: 0.27 },
  { y: 0.35, rx: 0.50, rz: 0.27 },
  // SHOULDER LINE (widest)
  { y: 0.38, rx: 0.505, rz: 0.265 },
  { y: 0.40, rx: 0.50, rz: 0.26 },
  { y: 0.42, rx: 0.49, rz: 0.25 },
  // SHOULDER → NECK transition
  { y: 0.44, rx: 0.46, rz: 0.235 },
  { y: 0.46, rx: 0.40, rz: 0.215 },
  { y: 0.48, rx: 0.33, rz: 0.195 },
  { y: 0.50, rx: 0.26, rz: 0.175 },
  // NECK
  { y: 0.52, rx: 0.20, rz: 0.155 },
  { y: 0.54, rx: 0.17, rz: 0.14 },
  { y: 0.56, rx: 0.15, rz: 0.13 },
  // COLLAR BAND (subtle outward flare)
  { y: 0.58, rx: 0.148, rz: 0.128 },
  { y: 0.60, rx: 0.15, rz: 0.13 },
  { y: 0.62, rx: 0.155, rz: 0.135 },
];

/* ── Color helpers ── */
function hexToRgb(hex) {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m
    ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
    : [0, 0, 0];
}
function darken(hex, f = 0.82) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}
function lighten(hex, f = 1.12) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r * f))},${Math.min(255, Math.round(g * f))},${Math.min(255, Math.round(b * f))})`;
}

/* ──────────────────────────────────────────────
   Build half-torso BufferGeometry
   startAngle=0, arcLen=π  → front (z ≥ 0)
   startAngle=π, arcLen=π  → back  (z ≤ 0)
   ────────────────────────────────────────────── */
function buildHalfTorso(startAngle, arcLen) {
  const halfSegs = CIRC_SEGS / 2;
  const rows = PROFILE.length;
  const cols = halfSegs + 1;
  const pos = [],
    uv = [],
    idx = [];

  for (let r = 0; r < rows; r++) {
    const { y, rx, rz } = PROFILE[r];
    const v = r / (rows - 1);
    for (let c = 0; c <= halfSegs; c++) {
      const u = c / halfSegs;
      const theta = startAngle + u * arcLen;
      pos.push(Math.cos(theta) * rx, y, Math.sin(theta) * rz);
      uv.push(u, 1 - v);
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < halfSegs; c++) {
      const a = r * cols + c,
        b = a + 1,
        d = a + cols,
        e = d + 1;
      idx.push(a, d, b, b, d, e);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(idx);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/* ──────────────────────────────────────────────
   Build sleeve — correct cross-section geometry.
   The first ring overlaps inside the body to
   create a seamless visual join.
   side: -1 = left, +1 = right
   ────────────────────────────────────────────── */
function buildSleeve(side) {
  const s = side;
  const numRings = 20;
  const radSegs = 24;

  // Arm path: starts slightly inside body, curves outward & down
  const controlPts = [
    new THREE.Vector3(s * 0.42, 0.37, 0), // inside body (overlap)
    new THREE.Vector3(s * 0.50, 0.35, 0), // at body surface
    new THREE.Vector3(s * 0.58, 0.31, 0), // emerging
    new THREE.Vector3(s * 0.66, 0.26, 0), // mid sleeve
    new THREE.Vector3(s * 0.74, 0.20, 0), // near cuff
    new THREE.Vector3(s * 0.80, 0.15, 0), // cuff end
  ];
  const armPath = new THREE.CatmullRomCurve3(controlPts);

  // Pre-compute centers & tangents
  const centers = [];
  const tangents = [];
  for (let i = 0; i <= numRings; i++) {
    const t = i / numRings;
    centers.push(armPath.getPointAt(t));
    tangents.push(armPath.getTangentAt(t).normalize());
  }

  // Cross-section radii: armhole → cuff taper
  const armholeRPerp = 0.16; // radius in plane perpendicular to arm (height)
  const armholeRZ = 0.14; // radius in Z direction (depth)
  const cuffRPerp = 0.085;
  const cuffRZ = 0.075;

  const pos = [],
    uv = [],
    idx = [];

  for (let ring = 0; ring <= numRings; ring++) {
    const t = ring / numRings;
    const center = centers[ring];
    const tangent = tangents[ring];

    // Perpendicular to arm direction in XY plane
    // For right arm (s=1): tangent≈(+, -, 0), perp≈(+, +, 0) → upward
    // For left arm (s=-1): tangent≈(-, -, 0), perp≈(-, +, 0) → upward
    let perpX = -tangent.y;
    let perpY = tangent.x;
    // Ensure perp points generally upward for both arms
    if (perpY < 0) {
      perpX = -perpX;
      perpY = -perpY;
    }
    const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
    perpX /= perpLen;
    perpY /= perpLen;

    // Interpolate radii with smooth easing
    const ease = t * t * (3 - 2 * t); // smoothstep
    const rPerp = armholeRPerp + (cuffRPerp - armholeRPerp) * ease;
    const rZ = armholeRZ + (cuffRZ - armholeRZ) * ease;

    // Flatten first rings slightly for body overlap
    const flattenPerp = t < 0.15 ? 1.0 + (0.15 - t) * 1.2 : 1.0;

    for (let j = 0; j <= radSegs; j++) {
      const angle = (j / radSegs) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Cross-section: cosA along perp (in XY plane), sinA along Z
      const px = center.x + cosA * rPerp * flattenPerp * perpX;
      const py = center.y + cosA * rPerp * flattenPerp * perpY;
      const pz = center.z + sinA * rZ;

      pos.push(px, py, pz);
      uv.push(j / radSegs, t);
    }
  }

  const cols = radSegs + 1;
  for (let ring = 0; ring < numRings; ring++) {
    for (let j = 0; j < radSegs; j++) {
      const a = ring * cols + j,
        b = a + 1,
        d = a + cols,
        e = d + 1;
      idx.push(a, d, b, b, d, e);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(idx);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/* ──────────────────────────────────────────────
   Paint jersey texture on canvas (1024 × 1024)
   ────────────────────────────────────────────── */
function useJerseyTexture(primary, secondary, isFront, name = "", number = "") {
  const [texture, setTexture] = useState(null);

  const paint = useCallback(() => {
    if (!primary) return;
    const W = 1024,
      H = 1024;
    const cvs = document.createElement("canvas");
    cvs.width = W;
    cvs.height = H;
    const ctx = cvs.getContext("2d");

    // ── Base gradient ──
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lighten(primary, 1.08));
    grad.addColorStop(0.5, primary);
    grad.addColorStop(1, darken(primary, 0.90));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ── Collar band (top of UV = collar on mesh) ──
    ctx.fillStyle = secondary;
    ctx.globalAlpha = 0.55;
    ctx.fillRect(0, 0, W, H * 0.025);
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, H * 0.025, W, H * 0.01);
    ctx.globalAlpha = 1;

    // ── Neckline shadow ──
    ctx.beginPath();
    ctx.moveTo(W * 0.36, 0);
    ctx.quadraticCurveTo(W * 0.5, H * 0.045, W * 0.64, 0);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fill();

    // ── Fabric knit texture (tiny grid) ──
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = darken(primary, 0.7);
    ctx.lineWidth = 0.5;
    for (let fy = 0; fy < H; fy += 6) {
      ctx.beginPath();
      ctx.moveTo(0, fy);
      ctx.lineTo(W, fy);
      ctx.stroke();
    }
    for (let fx = 0; fx < W; fx += 6) {
      ctx.beginPath();
      ctx.moveTo(fx, 0);
      ctx.lineTo(fx, H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ── Side panel accent stripes ──
    ctx.fillStyle = secondary;
    ctx.globalAlpha = 0.10;
    ctx.fillRect(0, 0, W * 0.04, H);
    ctx.fillRect(W * 0.96, 0, W * 0.04, H);
    ctx.globalAlpha = 0.05;
    ctx.fillRect(W * 0.04, 0, W * 0.02, H);
    ctx.fillRect(W * 0.94, 0, W * 0.02, H);
    ctx.globalAlpha = 1;

    // ── Shoulder seam line ──
    ctx.strokeStyle = darken(primary, 0.85);
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.04);
    ctx.lineTo(W, H * 0.04);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Hem band ──
    const hemGrad = ctx.createLinearGradient(0, H * 0.96, 0, H);
    hemGrad.addColorStop(0, "transparent");
    hemGrad.addColorStop(0.3, secondary);
    hemGrad.addColorStop(1, secondary);
    ctx.fillStyle = hemGrad;
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, H * 0.96, W, H * 0.04);
    ctx.globalAlpha = 1;

    // ── Center seam (subtle) ──
    ctx.strokeStyle = darken(primary, 0.88);
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.12;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.06);
    ctx.lineTo(W / 2, H * 0.96);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    if (isFront) {
      // ── Badge (left chest) ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(W * 0.34, H * 0.16, W * 0.035, 0, Math.PI * 2);
      ctx.fillStyle = secondary;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(W * 0.34, H * 0.16, W * 0.025, 0, Math.PI * 2);
      ctx.strokeStyle = secondary;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // ── Sponsor area ──
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = secondary;
      ctx.fillRect(W * 0.35, H * 0.12, W * 0.30, H * 0.08);
      ctx.globalAlpha = 1;
    } else {
      // ── BACK: name & number ──
      const dn = (name || "").toUpperCase().slice(0, 12);
      const dnum = number != null && number !== "" ? String(number) : "";

      if (dn) {
        const sz = Math.min(W * 0.065, W / (dn.length * 0.72));
        ctx.font = `900 ${sz}px ${JERSEY_FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const ny = H * 0.20;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillText(dn, W / 2 + 2, ny + 2);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = sz * 0.14;
        ctx.lineJoin = "round";
        ctx.strokeText(dn, W / 2, ny);
        ctx.fillStyle = "#FFF";
        ctx.fillText(dn, W / 2, ny);
      }

      if (dnum) {
        const sz = W * 0.24;
        ctx.font = `900 ${sz}px ${JERSEY_FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const ny = dn ? H * 0.42 : H * 0.36;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillText(dnum, W / 2 + 3, ny + 3);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = sz * 0.07;
        ctx.lineJoin = "round";
        ctx.strokeText(dnum, W / 2, ny);
        ctx.fillStyle = "#FFF";
        ctx.fillText(dnum, W / 2, ny);
      }

      if (!dn && !dnum) {
        ctx.font = `600 ${W * 0.028}px ${JERSEY_FONT}`;
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillText("YOUR NAME & NUMBER", W / 2, H * 0.36);
      }
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    setTexture(tex);
  }, [primary, secondary, isFront, name, number]);

  useEffect(() => {
    paint();
  }, [paint]);
  return texture;
}

/* ──────────────────────────────────────────────
   Sleeve texture — gradient + cuff band
   ────────────────────────────────────────────── */
function useSleeveTexture(primary, secondary) {
  const [texture, setTexture] = useState(null);

  const paint = useCallback(() => {
    if (!primary) return;
    const W = 512,
      H = 512;
    const cvs = document.createElement("canvas");
    cvs.width = W;
    cvs.height = H;
    const ctx = cvs.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, lighten(primary, 1.05));
    grad.addColorStop(1, darken(primary, 0.92));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Knit texture
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = darken(primary, 0.7);
    ctx.lineWidth = 0.5;
    for (let fy = 0; fy < H; fy += 6) {
      ctx.beginPath();
      ctx.moveTo(0, fy);
      ctx.lineTo(W, fy);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Cuff band at sleeve end
    ctx.fillStyle = secondary;
    ctx.globalAlpha = 0.18;
    ctx.fillRect(W * 0.86, 0, W * 0.14, H);
    ctx.globalAlpha = 1;

    // Shoulder seam
    ctx.strokeStyle = darken(primary, 0.85);
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.moveTo(W * 0.05, 0);
    ctx.lineTo(W * 0.05, H);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    setTexture(tex);
  }, [primary, secondary]);

  useEffect(() => {
    paint();
  }, [paint]);
  return texture;
}

/* ──────────────────────────────────────────────
   JerseyMesh — torso (front+back) + two sleeves
   Collar is part of the body mesh profile,
   NOT a separate floating ring.
   ────────────────────────────────────────────── */
function JerseyMesh({
  primaryColor,
  secondaryColor,
  playerName,
  playerNumber,
  autoRotate,
}) {
  const ref = useRef();

  const frontTex = useJerseyTexture(primaryColor, secondaryColor, true);
  const backTex = useJerseyTexture(
    primaryColor,
    secondaryColor,
    false,
    playerName,
    playerNumber,
  );
  const sleeveTex = useSleeveTexture(primaryColor, secondaryColor);

  const frontGeo = useMemo(() => buildHalfTorso(0, Math.PI), []);
  const backGeo = useMemo(() => buildHalfTorso(Math.PI, Math.PI), []);
  const leftSleeve = useMemo(() => buildSleeve(-1), []);
  const rightSleeve = useMemo(() => buildSleeve(1), []);

  useFrame((_, dt) => {
    if (autoRotate && ref.current) ref.current.rotation.y += dt * 0.5;
  });

  if (!frontTex || !backTex) return null;

  const bodyMat = { roughness: 0.65, metalness: 0.0, side: THREE.DoubleSide };

  return (
    <group ref={ref}>
      {/* Front half */}
      <mesh geometry={frontGeo}>
        <meshStandardMaterial map={frontTex} {...bodyMat} />
      </mesh>
      {/* Back half */}
      <mesh geometry={backGeo}>
        <meshStandardMaterial map={backTex} {...bodyMat} />
      </mesh>
      {/* Left sleeve */}
      <mesh geometry={leftSleeve}>
        <meshStandardMaterial map={sleeveTex} {...bodyMat} />
      </mesh>
      {/* Right sleeve */}
      <mesh geometry={rightSleeve}>
        <meshStandardMaterial map={sleeveTex} {...bodyMat} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Grid floor + contact shadow
   ────────────────────────────────────────────── */
function GridFloor({ isHero }) {
  return (
    <>
      <gridHelper
        args={[
          4,
          24,
          isHero ? "#ffffff12" : "#1565c012",
          isHero ? "#ffffff06" : "#1565c006",
        ]}
        position={[0, -0.71, 0]}
      />
      <ContactShadows
        position={[0, -0.70, 0]}
        opacity={isHero ? 0.25 : 0.35}
        scale={3.5}
        blur={3}
        far={2.5}
        color={isHero ? "#000" : "#0d47a1"}
      />
    </>
  );
}

/* ──────────────────────────────────────────────
   Main exported component
   ────────────────────────────────────────────── */
export default function JerseyViewer3D({
  primaryColor = "#1565c0",
  secondaryColor = "#FFFFFF",
  playerName = "",
  playerNumber = null,
  width = 280,
  height = 340,
  variant = "default",
  autoFlip = false,
}) {
  const isHero = variant === "hero";

  return (
    <div
      style={{
        width,
        height,
        margin: "0 auto",
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: isHero
          ? "transparent"
          : "linear-gradient(180deg, #f8fafc 0%, #eef1f5 100%)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.05, 2.1], fov: 38 }}
        gl={{
          antialias: true,
          alpha: isHero,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: isHero ? "transparent" : undefined }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[2.5, 4, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.35}
          color="#a0c4e8"
        />
        <pointLight position={[0, 1.5, 3]} intensity={0.25} color="#fff" />
        <pointLight position={[0, -0.5, -2]} intensity={0.15} color="#c0d0e0" />

        <JerseyMesh
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          playerName={playerName}
          playerNumber={playerNumber}
          autoRotate={autoFlip}
        />

        <GridFloor isHero={isHero} />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={1.3}
          maxDistance={3.5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.7}
          target={[0, -0.05, 0]}
          enableDamping
          dampingFactor={0.08}
          makeDefault
        />
      </Canvas>

      {/* Hint badge */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 12px",
          borderRadius: 12,
          background: isHero ? "rgba(0,0,0,0.4)" : "rgba(21,101,192,0.08)",
          backdropFilter: "blur(8px)",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: isHero ? "rgba(255,255,255,0.75)" : "#1565c0",
          }}
        >
          🖱️ Drag to rotate
        </span>
      </div>
    </div>
  );
}
