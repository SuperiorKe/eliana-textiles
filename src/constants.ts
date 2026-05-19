import { Product } from "./types";

export const WHATSAPP_NUMBER = "254715035359";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Silk Touch Duvet",
    category: "Duvets",
    price: 249,
    description: "Ultra-soft silk-filled duvet for year-round comfort.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578898809054-06cba0cd9961?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583005852579-247012d27402?q=80&w=2000&auto=format&fit=crop"
    ],
    reviews: [
      { id: "r1", userName: "Sophia L.", rating: 5, comment: "Like sleeping on a cloud. Best investment for my bedroom.", date: "Oct 12, 2024" },
      { id: "r2", userName: "Marcus T.", rating: 4, comment: "Incredibly soft, though a bit warmer than expected.", date: "Nov 02, 2024" }
    ],
    attributes: { material: "Pure Silk", weight: "2.5kg", threadCount: "N/A" }
  },
  {
    id: "2",
    name: "Orthopedic Cloud Mattress",
    category: "Mattresses",
    price: 899,
    description: "Ten layers of responsive foam for the perfect night's sleep.",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop",
    reviews: [
      { id: "r3", userName: "Elena R.", rating: 5, comment: "Back pain is gone. Service was excellent too.", date: "Dec 15, 2024" }
    ],
    attributes: { material: "Memory Foam", firmness: "Medium-Firm", weight: "35kg" }
  },
  {
    id: "3",
    name: "Egyptian Cotton Sheet Set",
    category: "Bed Sheets",
    price: 159,
    description: "1000 thread-count genuine Egyptian cotton in ivory.",
    image: "https://images.unsplash.com/photo-1629739884942-8678d136ad62?q=80&w=1974&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1629739884942-8678d136ad62?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574738530265-1d48419616d2?q=80&w=2000&auto=format&fit=crop"
    ],
    reviews: [
      { id: "r4", userName: "David K.", rating: 5, comment: "Crisp, cool, and clearly high quality.", date: "Jan 05, 2025" }
    ],
    attributes: { material: "Giza 86 Cotton", threadCount: "1000", weight: "1.2kg" }
  },
  {
    id: "4",
    name: "Velvet Comfort Duvet",
    category: "Duvets",
    price: 199,
    description: "Crushed velvet exterior with hypoallergenic microfibre fill.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop",
    reviews: [],
    attributes: { material: "Crushed Velvet", weight: "3.2kg", threadCount: "N/A" }
  },
  {
    id: "5",
    name: "Percale Classic Sheets",
    category: "Bed Sheets",
    price: 129,
    description: "Crisp and cool cotton percale for hot sleepers.",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
    reviews: [],
    attributes: { material: "Cotton Percale", threadCount: "400", weight: "1.0kg" }
  },
  {
    id: "6",
    name: "Hybrid Memory Mattress",
    category: "Mattresses",
    price: 749,
    description: "Pocket springs meets memory foam for balanced support.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
    reviews: [],
    attributes: { material: "Hybrid Foam/Spring", firmness: "Medium", weight: "40kg" }
  },
];
