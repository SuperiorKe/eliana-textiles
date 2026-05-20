// Keep this data in sync with src/data/products.ts (which drives local dev via server.ts).
// Vercel runs this file as a standalone ESM serverless function; relative imports from
// src/ are not bundled in ESM mode, so the catalogue lives here too.
const PRODUCTS = [
  {
    id: "1",
    name: "Premium Luxury Duvet Set",
    category: "Duvets",
    price: 5500,
    description: "Microfiber blend, 200×230cm double size, 3.5kg fill weight. Available in white and ivory. MOQ 5 units for wholesale pricing.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578898809054-06cba0cd9961?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583005852579-247012d27402?q=80&w=2000&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", userName: "Amani", rating: 5, comment: "The best quality duvets in Nairobi. Highly recommended!", date: "Oct 12, 2024" },
      { id: "r2", userName: "Kendi", rating: 4, comment: "Very warm and high quality finishing. Will buy again.", date: "Nov 02, 2024" },
    ],
    attributes: { material: "Microfiber Blend", weight: "3.5kg" },
  },
  {
    id: "2",
    name: "Cloud-Comfort Orthopedic Mattress",
    category: "Mattresses",
    price: 28500,
    description: "High-density orthopedic foam, 190×150cm queen size, 25kg. Firm support for back and side sleepers. 10-year durability warranty.",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop",
    reviews: [
      { id: "r3", userName: "Otieno", rating: 5, comment: "I finally sleep through the night. Great value.", date: "Dec 15, 2024" },
    ],
    attributes: { material: "High-Density Foam", firmness: "Firm", weight: "25kg" },
  },
  {
    id: "3",
    name: "Silky Smooth Cotton Set",
    category: "Bed Sheets",
    price: 3800,
    description: "Polycotton 800TC, queen fitted + flat sheet + 2 pillowcases. Fade-resistant dye. Washes well up to 60°C. MOQ 3 sets.",
    image: "https://images.unsplash.com/photo-1629739884942-8678d136ad62?q=80&w=1974&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1629739884942-8678d136ad62?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574738530265-1d48419616d2?q=80&w=2000&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r4", userName: "Wanjiru", rating: 5, comment: "Beautiful textures and colors.", date: "Jan 05, 2025" },
    ],
    attributes: { material: "Polycotton", threadCount: "800", weight: "1.2kg" },
  },
  {
    id: "4",
    name: "Premium Mattress Protector",
    category: "Mattresses",
    price: 2500,
    description: "Terry cotton waterproof layer, fits queen and king mattresses up to 35cm deep. Machine washable. Extends mattress life by years.",
    image: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?q=80&w=2070&auto=format&fit=crop",
    reviews: [],
    attributes: { material: "Terry Cotton", weight: "0.8kg" },
  },
  {
    id: "5",
    name: "Decorative Throw Pillows",
    category: "Accessories",
    price: 1200,
    description: "Velvet finish, 45×45cm. Removable zip-off cover. Pairs with Classic Hotel Duvet Set. Sold individually or in sets of 4.",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
    reviews: [],
    attributes: { material: "Velvet Finish", weight: "0.5kg" },
  },
  {
    id: "6",
    name: "Classic Hotel Duvet Set",
    category: "Duvets",
    price: 4200,
    description: "Hypoallergenic microfibre, 200×230cm. Includes matching fitted sheet and 2 pillowcases. The full hotel bed setup in one order.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
    reviews: [],
    attributes: { material: "Hypoallergenic Microfibre", weight: "3.0kg" },
  },
];

export default function handler(_req: any, res: any) {
  res.json(PRODUCTS);
}
