/**
 * Seed FIFA World Cup 2026 jerseys into the database.
 * Run:  cd backend && node utils/seedProducts.js
 */
import dns from "dns";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import ProductModel from "../models/ProductModel.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config({
  path: join(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const jerseys = [
  {
    name: "Brazil Home Jersey 2026",
    team: "Brazil",
    league: "FIFA World Cup 2026",
    primaryColor: "#FFCC00",
    secondaryColor: "#006B3F",
    description:
      "The iconic Seleção home kit in vibrant Canarinho yellow with green accents. Made from breathable performance fabric with moisture-wicking technology. Features the CBF crest and FIFA World Cup 2026 badge. Perfect for showing your support for the 5-time world champions.",
    price: 3500,
    discountPrice: 2999,
    images: [
      { url: "/jerseys/brazil_front.png" },
      { url: "/jerseys/brazil_back.png" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 50,
    rating: 4.8,
    numReviews: 24,
    isActive: true,
  },
  {
    name: "Argentina Home Jersey 2026",
    team: "Argentina",
    league: "FIFA World Cup 2026",
    primaryColor: "#75B2DD",
    secondaryColor: "#FFFFFF",
    description:
      "The legendary Albiceleste home jersey featuring classic sky blue and white vertical stripes. Premium polyester with Climalite technology for superior comfort. Includes the AFA badge and three championship stars. Worn by the defending champions.",
    price: 3800,
    discountPrice: 3299,
    images: [
      { url: "/jerseys/argentina_front.png" },
      { url: "/jerseys/argentina_back.png" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    rating: 4.9,
    numReviews: 31,
    isActive: true,
  },
  {
    name: "Germany Home Jersey 2026",
    team: "Germany",
    league: "FIFA World Cup 2026",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    description:
      "The classic Die Mannschaft white home jersey with bold black and gold accents. Features the iconic four-star DFB crest and diagonal German flag stripe across the chest. Lightweight, breathable match-day fabric built for performance.",
    price: 3500,
    discountPrice: null,
    images: [
      { url: "/jerseys/germany_front.png" },
      { url: "/jerseys/germany_back.png" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 40,
    rating: 4.6,
    numReviews: 18,
    isActive: true,
  },
  {
    name: "France Home Jersey 2026",
    team: "France",
    league: "FIFA World Cup 2026",
    primaryColor: "#1E3A5F",
    secondaryColor: "#C5A44E",
    description:
      "Les Bleus' iconic dark navy home jersey with elegant gold accents and tricolore sleeve details. Crafted from premium fabric featuring the FFF crest and two championship stars. Sophisticated design meets elite performance technology.",
    price: 3800,
    discountPrice: 3499,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
    rating: 4.7,
    numReviews: 22,
    isActive: true,
  },
  {
    name: "Portugal Home Jersey 2026",
    team: "Portugal",
    league: "FIFA World Cup 2026",
    primaryColor: "#DC143C",
    secondaryColor: "#006B3F",
    description:
      "The bold crimson red home jersey of the Seleção das Quinas with traditional green panel. Features the FPF crest in gold and the iconic number 7 legacy. Designed with DriFit technology for match-day comfort and style.",
    price: 3500,
    discountPrice: null,
    images: [
      { url: "/jerseys/portugol_front.png" },
      { url: "/jerseys/portugol_back.png" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 38,
    rating: 4.7,
    numReviews: 19,
    isActive: true,
  },
  {
    name: "Spain Home Jersey 2026",
    team: "Spain",
    league: "FIFA World Cup 2026",
    primaryColor: "#CC0000",
    secondaryColor: "#FFD700",
    description:
      "La Roja's vibrant red home jersey with striking yellow accents inspired by Spain's royal crest. Features diamond-pattern texture, RFEF badge, and gold championship star. Engineered with AeroReact ventilation for peak performance.",
    price: 3500,
    discountPrice: 2899,
    images: [
      { url: "/jerseys/spain_front.png" },
      { url: "/jerseys/spain_back.png" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 42,
    rating: 4.5,
    numReviews: 15,
    isActive: true,
  },
  {
    name: "England Home Jersey 2026",
    team: "England",
    league: "FIFA World Cup 2026",
    primaryColor: "#FFFFFF",
    secondaryColor: "#001F7F",
    description:
      "The Three Lions' pristine white home jersey with navy blue collar and subtle St George's Cross pattern. Features the classic England crest and red side accents. Premium breathable mesh fabric designed for the modern game.",
    price: 3800,
    discountPrice: null,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    stock: 30,
    rating: 4.6,
    numReviews: 20,
    isActive: true,
  },
  {
    name: "Nepal Home Jersey 2026",
    team: "Nepal",
    league: "FIFA World Cup 2026",
    primaryColor: "#DC143C",
    secondaryColor: "#003893",
    description:
      "Show your pride for the Gorkhalis! The Nepal national team home jersey in bold crimson red with traditional blue accents inspired by the Nepal flag. Features the ANFA crest and premium quality fabric. A must-have for every Nepali football fan.",
    price: 2500,
    discountPrice: 1999,
    images: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 100,
    rating: 4.9,
    numReviews: 42,
    isActive: true,
  },
  {
    name: "Japan Home Jersey 2026",
    team: "Japan",
    league: "FIFA World Cup 2026",
    primaryColor: "#002FA7",
    secondaryColor: "#FFFFFF",
    description:
      "The Samurai Blue's striking deep blue home jersey with origami-inspired geometric pattern. Features the JFA crest with rising sun emblem and clean white collar. Advanced heat-ready technology with recycled performance fabric.",
    price: 3200,
    discountPrice: 2799,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    stock: 28,
    rating: 4.8,
    numReviews: 26,
    isActive: true,
  },
  {
    name: "Netherlands Home Jersey 2026",
    team: "Netherlands",
    league: "FIFA World Cup 2026",
    primaryColor: "#FF6600",
    secondaryColor: "#000000",
    description:
      "Oranje's legendary bright orange home jersey with classic black accents and lion emblem. Features horizontal stripe texture and KNVB crest. Total Football reimagined with cutting-edge thermoregulation fabric for the 2026 tournament.",
    price: 3500,
    discountPrice: null,
    images: [],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 33,
    rating: 4.5,
    numReviews: 14,
    isActive: true,
  },
  {
    name: "Italy Home Jersey 2026",
    team: "Italy",
    league: "FIFA World Cup 2026",
    primaryColor: "#0066B3",
    secondaryColor: "#FFFFFF",
    description:
      "The Azzurri's elegant blue home jersey with Renaissance-inspired details and four championship stars. Features tricolore sleeve accents, FIGC crest in gold, and premium Italian craftsmanship. A celebration of football heritage and style.",
    price: 3800,
    discountPrice: 3299,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    stock: 36,
    rating: 4.7,
    numReviews: 21,
    isActive: true,
  },
  {
    name: "Mexico Home Jersey 2026",
    team: "Mexico",
    league: "FIFA World Cup 2026",
    primaryColor: "#006847",
    secondaryColor: "#CE1126",
    description:
      "El Tri's stunning dark green home jersey with Aztec-inspired diamond pattern and red accent stripe. Features the FMF eagle crest and traditional white collar. Co-host nation's special edition with advanced sweat-wicking technology.",
    price: 3200,
    discountPrice: 2699,
    images: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 48,
    rating: 4.6,
    numReviews: 17,
    isActive: true,
  },
  {
    name: "USA Home Jersey 2026",
    team: "United States",
    league: "FIFA World Cup 2026",
    primaryColor: "#FFFFFF",
    secondaryColor: "#002868",
    description:
      "The USMNT's crisp white home jersey with patriotic red and blue accents for the historic home tournament. Features diagonal stripe detailing, US Soccer crest, and navy blue yoke. Special co-host edition with premium climate-control technology.",
    price: 3500,
    discountPrice: null,
    images: [],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 55,
    rating: 4.4,
    numReviews: 12,
    isActive: true,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Remove existing products (optional — keeps it idempotent)
    const deleted = await ProductModel.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing products`);

    const created = await ProductModel.insertMany(jerseys);
    console.log(`🎽 Seeded ${created.length} FIFA World Cup 2026 jerseys:`);
    created.forEach((p) =>
      console.log(`   • ${p.name} — Rs. ${p.discountPrice ?? p.price}`),
    );

    await mongoose.disconnect();
    console.log("\n✅ Done! Products are ready.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedProducts();
