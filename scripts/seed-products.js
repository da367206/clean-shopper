import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

const products = [
  // Personal Care
  {
    name: "Pure Castile Soap",
    brand: "Dr. Bronner's",
    category: "Personal Care",
    safety_score: "clean",
    score: 94,
    description: "Organic, fair trade, no synthetic preservatives or detergents. Safe for skin and the environment.",
  },
  {
    name: "Native Deodorant",
    brand: "Native",
    category: "Personal Care",
    safety_score: "clean",
    score: 88,
    description: "Aluminum-free with naturally derived ingredients. No parabens, sulfates, or phthalates.",
  },
  {
    name: "Gentle Gel Cleanser",
    brand: "Honest Beauty",
    category: "Personal Care",
    safety_score: "clean",
    score: 85,
    description: "Dermatologist-tested, sulfate- and paraben-free. Removes makeup without stripping skin.",
  },
  {
    name: "Beeswax Lip Balm",
    brand: "Burt's Bees",
    category: "Personal Care",
    safety_score: "clean",
    score: 91,
    description: "100% natural origin ingredients including beeswax and peppermint oil. No petrolatum or parabens.",
  },
  {
    name: "Rose + Vanilla Deodorant",
    brand: "Schmidt's",
    category: "Personal Care",
    safety_score: "caution",
    score: 67,
    description: "Plant-based formula with magnesium, but contains a fragrance blend that may cause skin sensitivity.",
  },

  // Home Cleaning
  {
    name: "Branch Basics Concentrate",
    brand: "Branch Basics",
    category: "Home Cleaning",
    safety_score: "clean",
    score: 96,
    description: "Plant- and mineral-based concentrate with no synthetic fragrances. Replaces all household cleaners.",
  },
  {
    name: "All-Purpose Cleaner",
    brand: "Method",
    category: "Home Cleaning",
    safety_score: "caution",
    score: 54,
    description: "Plant-derived surfactants but contains synthetic fragrances and undisclosed preservatives.",
  },
  {
    name: "Free & Clear Laundry Detergent",
    brand: "Seventh Generation",
    category: "Home Cleaning",
    safety_score: "clean",
    score: 82,
    description: "USDA Biobased certified with plant-based surfactants. Free of optical brighteners and synthetic fragrances.",
  },
  {
    name: "Clean Day Multi-Surface Cleaner",
    brand: "Mrs. Meyer's",
    category: "Home Cleaning",
    safety_score: "caution",
    score: 61,
    description: "Plant-derived cleaning agents but uses synthetic fragrance and lacks full preservative transparency.",
  },
  {
    name: "Dish Soap",
    brand: "ECOS",
    category: "Home Cleaning",
    safety_score: "clean",
    score: 89,
    description: "EPA Safer Choice certified with plant-derived surfactants and essential oils. Biodegradable.",
  },

  // Baby Care
  {
    name: "Baby Shampoo + Body Wash",
    brand: "The Honest Company",
    category: "Baby Care",
    safety_score: "clean",
    score: 92,
    description: "Tear-free, sulfate-free formula with plant-based ingredients. Dermatologist and pediatrician tested.",
  },
  {
    name: "Baby Nourishing Lotion",
    brand: "Burt's Bees",
    category: "Baby Care",
    safety_score: "clean",
    score: 90,
    description: "98.9% natural ingredients. Pediatrician-tested, free of parabens, phthalates, and petrolatum.",
  },
  {
    name: "Bubble Bath",
    brand: "Babyganics",
    category: "Baby Care",
    safety_score: "caution",
    score: 68,
    description: "Plant-based but contains some synthetic ingredients. Fragrance listed as natural but not fully disclosed.",
  },
  {
    name: "Diaper Balm",
    brand: "Earth Mama",
    category: "Baby Care",
    safety_score: "clean",
    score: 95,
    description: "Certified organic ingredients only. No zinc oxide, petrolatum, or talc. Safe for cloth diapers.",
  },
  {
    name: "Natural Baby Wash",
    brand: "Puracy",
    category: "Baby Care",
    safety_score: "clean",
    score: 87,
    description: "Hypoallergenic, plant-based formula developed with pediatricians. Free of sulfates and synthetic dyes.",
  },

  // Kitchen
  {
    name: "Dish Soap",
    brand: "Better Life",
    category: "Kitchen",
    safety_score: "clean",
    score: 86,
    description: "Plant-derived, cruelty-free formula with no synthetic fragrances. Cuts grease without harsh chemicals.",
  },
  {
    name: "Zero Dish Soap",
    brand: "Ecover",
    category: "Kitchen",
    safety_score: "clean",
    score: 88,
    description: "Fragrance-free with plant-based surfactants. Packaged in recycled plastic, fully biodegradable.",
  },
  {
    name: "Natural Dish Soap",
    brand: "Puracy",
    category: "Kitchen",
    safety_score: "clean",
    score: 91,
    description: "Hypoallergenic with full ingredient transparency. No sulfates, synthetic dyes, or artificial fragrances.",
  },
  {
    name: "Ultra Original Dish Soap",
    brand: "Dawn",
    category: "Kitchen",
    safety_score: "caution",
    score: 52,
    description: "Effective degreaser but contains synthetic fragrances, dyes, and preservatives with undisclosed ingredients.",
  },
  {
    name: "Ultra Dish Soap",
    brand: "Ajax",
    category: "Kitchen",
    safety_score: "avoid",
    score: 28,
    description: "Contains synthetic fragrances, dyes, and surfactants with moderate safety concerns. Limited ingredient transparency.",
  },
]

const { data, error } = await supabase.from('products').insert(products).select('id, name, brand')

if (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
}

console.log(`Inserted ${data.length} products:`)
data.forEach(p => console.log(`  ✓ ${p.brand} – ${p.name} (${p.id})`))
