/**
 * JerseySilhouette — lightweight inline SVG jersey shape
 * used in ProductCard and CartScreen as a color-based thumbnail.
 * Higher detail with fabric texture, stitching, and depth effects.
 */
const JerseySilhouette = ({
  primaryColor = "#1565c0",
  secondaryColor = "#FFFFFF",
  width = "100%",
  height = "100%",
}) => {
  const id = primaryColor.replace("#", "") + secondaryColor.replace("#", "");

  return (
    <svg
      viewBox="0 0 200 240"
      width={width}
      height={height}
      style={{ display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Body gradient */}
        <linearGradient id={`jg-${id}`} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="55%" stopColor={primaryColor} stopOpacity="0.92" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.78" />
        </linearGradient>

        {/* Depth shadow for 3D feel */}
        <radialGradient id={`js-${id}`} cx="0.5" cy="0.35" r="0.55">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </radialGradient>

        {/* Fabric pattern */}
        <pattern
          id={`fp-${id}`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="4" height="4" fill="transparent" />
          <line
            x1="0"
            y1="2"
            x2="4"
            y2="2"
            stroke="#000"
            strokeWidth="0.3"
            opacity="0.06"
          />
          <line
            x1="2"
            y1="0"
            x2="2"
            y2="4"
            stroke="#000"
            strokeWidth="0.2"
            opacity="0.04"
          />
        </pattern>

        {/* Drop shadow filter */}
        <filter id={`ds-${id}`} x="-5%" y="-3%" width="110%" height="110%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#000"
            floodOpacity="0.15"
          />
        </filter>

        {/* Body clip path */}
        <clipPath id={`bc-${id}`}>
          <path d="M62,30 L42,40 L12,78 L30,90 L50,58 L50,216 L150,216 L150,58 L170,90 L188,78 L158,40 L138,30 C128,48 116,56 100,56 C84,56 72,48 62,30 Z" />
        </clipPath>
      </defs>

      {/* Jersey body with shadow */}
      <path
        d="M62,30 L42,40 L12,78 L30,90 L50,58 L50,216 L150,216 L150,58 L170,90 L188,78 L158,40 L138,30
           C128,48 116,56 100,56 C84,56 72,48 62,30 Z"
        fill={`url(#jg-${id})`}
        filter={`url(#ds-${id})`}
      />

      {/* Depth overlay */}
      <path
        d="M62,30 L42,40 L12,78 L30,90 L50,58 L50,216 L150,216 L150,58 L170,90 L188,78 L158,40 L138,30
           C128,48 116,56 100,56 C84,56 72,48 62,30 Z"
        fill={`url(#js-${id})`}
      />

      {/* Fabric texture overlay */}
      <path
        d="M62,30 L42,40 L12,78 L30,90 L50,58 L50,216 L150,216 L150,58 L170,90 L188,78 L158,40 L138,30
           C128,48 116,56 100,56 C84,56 72,48 62,30 Z"
        fill={`url(#fp-${id})`}
      />

      {/* Side accent stripes */}
      <g clipPath={`url(#bc-${id})`}>
        <rect
          x="48"
          y="56"
          width="5"
          height="162"
          fill={secondaryColor}
          opacity="0.12"
        />
        <rect
          x="147"
          y="56"
          width="5"
          height="162"
          fill={secondaryColor}
          opacity="0.12"
        />
      </g>

      {/* Body outline */}
      <path
        d="M62,30 L42,40 L12,78 L30,90 L50,58 L50,216 L150,216 L150,58 L170,90 L188,78 L158,40 L138,30
           C128,48 116,56 100,56 C84,56 72,48 62,30 Z"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Collar — thicker V-neck with fill */}
      <path
        d="M62,30 C72,48 84,56 100,56 C116,56 128,48 138,30"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M64,31 C73,47 85,54 100,54 C115,54 127,47 136,31"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Sleeve cuff bands */}
      <line
        x1="28"
        y1="89"
        x2="50"
        y2="57"
        stroke={secondaryColor}
        strokeWidth="3"
        opacity="0.25"
        strokeLinecap="round"
      />
      <line
        x1="172"
        y1="89"
        x2="150"
        y2="57"
        stroke={secondaryColor}
        strokeWidth="3"
        opacity="0.25"
        strokeLinecap="round"
      />

      {/* Center stitching line (subtle) */}
      <line
        x1="100"
        y1="56"
        x2="100"
        y2="216"
        stroke={secondaryColor}
        strokeWidth="0.5"
        opacity="0.08"
        strokeDasharray="3,3"
      />

      {/* Hem band */}
      <g clipPath={`url(#bc-${id})`}>
        <rect
          x="50"
          y="210"
          width="100"
          height="6"
          fill={secondaryColor}
          opacity="0.12"
        />
      </g>

      {/* Badge — double ring */}
      <circle cx="78" cy="88" r="10" fill={secondaryColor} opacity="0.25" />
      <circle
        cx="78"
        cy="88"
        r="7"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="0.8"
        opacity="0.2"
      />

      {/* Shoulder seam hints */}
      <line
        x1="50"
        y1="58"
        x2="62"
        y2="30"
        stroke="#000"
        strokeWidth="0.6"
        opacity="0.06"
      />
      <line
        x1="150"
        y1="58"
        x2="138"
        y2="30"
        stroke="#000"
        strokeWidth="0.6"
        opacity="0.06"
      />
    </svg>
  );
};

export default JerseySilhouette;
