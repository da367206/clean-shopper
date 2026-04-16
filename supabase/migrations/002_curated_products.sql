-- Migration: Replace seeded products with curated catalog + high-quality images
-- Run in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- 1. Ensure image_url column exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Clear the existing product catalog
TRUNCATE TABLE public.products;

-- 3. Insert curated products with Amazon CDN images
INSERT INTO public.products (name, brand, category, description, safety_score, score, image_url) VALUES

-- Personal Care
(
  'Fragrance-Free Shampoo Bar',
  'Ethique',
  'Personal Care',
  'A concentrated, zero-waste solid shampoo bar free from sulfates, parabens, and synthetic fragrance. Biodegradable formula that''s gentle on sensitive scalps and kind to the planet.',
  'clean',
  92,
  'https://m.media-amazon.com/images/I/61gCgx2Y--L._SL1500_.jpg'
),
(
  'Mineral Sunscreen Cream SPF 50',
  'Badger',
  'Personal Care',
  'Reef-safe, non-nano zinc oxide sunscreen with just six ingredients. Free from oxybenzone, octinoxate, and synthetic fragrance. Certified organic and biodegradable.',
  'clean',
  88,
  'https://m.media-amazon.com/images/I/61ElvwyfyeL._SL1500_.jpg'
),
(
  'Aluminum-Free Deodorant',
  'Native',
  'Personal Care',
  'An effective aluminum-free deodorant made with baking soda, coconut oil, and shea butter. Free from parabens and phthalates. Available in unscented and natural scent options.',
  'caution',
  74,
  'https://m.media-amazon.com/images/I/61CDk0aPrfL._SL1500_.jpg'
),
(
  'Pure Castile Liquid Soap Unscented',
  'Dr. Bronner''s',
  'Personal Care',
  'A certified fair-trade, organic castile soap made with just saponified oils and water. No synthetic preservatives, detergents, or foaming agents. Versatile and gentle for skin, hair, and home.',
  'clean',
  95,
  'https://m.media-amazon.com/images/I/71W6dTvROYL._SL1500_.jpg'
),
(
  'Certified Organic Rosehip Oil',
  'Trilogy',
  'Personal Care',
  'Cold-pressed, certified organic rosehip seed oil rich in omega fatty acids and antioxidants. A single-ingredient facial oil with no added fragrances, preservatives, or synthetic additives.',
  'clean',
  97,
  'https://m.media-amazon.com/images/I/61lcjdVXTXL._SL1500_.jpg'
),
(
  'Activated Charcoal Toothpaste',
  'Hello',
  'Personal Care',
  'A fluoride-free toothpaste with bamboo charcoal for natural whitening. Free from SLS, artificial sweeteners, preservatives, and dyes. Vegan and cruelty-free certified.',
  'clean',
  81,
  'https://m.media-amazon.com/images/I/71xzV0+bOLL._SL1500_.jpg'
),

-- Home Cleaning
(
  'All-Purpose Cleaning Spray',
  'Branch Basics',
  'Home Cleaning',
  'A plant-based, fragrance-free multi-surface cleaner made from a concentrate. Free from synthetic fragrance, preservatives, and any known harmful chemicals. EWG Verified.',
  'clean',
  94,
  'https://m.media-amazon.com/images/I/614ENtEQvOL._AC_SL1500_.jpg'
),
(
  'Oxygen Brightener Powder',
  'Molly''s Suds',
  'Home Cleaning',
  'A non-chlorine oxygen-based brightener and stain remover for laundry and surfaces. Made with sodium percarbonate and washing soda — no optical brighteners, synthetic fragrance, or harsh chemicals.',
  'clean',
  89,
  'https://m.media-amazon.com/images/I/61hSWbfwDfL._AC_SL1080_.jpg'
),
(
  'Free & Clear Dishwasher Packs',
  'Seventh Generation',
  'Home Cleaning',
  'Plant-based dishwasher detergent pods that are free from synthetic fragrance, chlorine bleach, and phosphates. USDA Certified Biobased. EPA Safer Choice certified.',
  'caution',
  76,
  'https://m.media-amazon.com/images/I/81yQoTrpvRL._AC_SL1500_.jpg'
),
(
  'Glass & Surface Cleaner',
  'Better Life',
  'Home Cleaning',
  'A plant-derived, streak-free glass and surface cleaner made without ammonia, synthetic fragrance, or harsh chemicals. EPA Safer Choice certified and safe around kids and pets.',
  'clean',
  91,
  'https://m.media-amazon.com/images/I/61HIZOV6n9L._AC_SL1500_.jpg'
),
(
  'Wool Dryer Balls',
  'Friendsheep',
  'Home Cleaning',
  'Handmade, fair-trade New Zealand wool dryer balls that replace single-use dryer sheets. Reduce drying time, soften fabrics naturally, and eliminate static without any chemicals or synthetic fragrance.',
  'clean',
  98,
  'https://m.media-amazon.com/images/I/81m8uuu+x-L._AC_SL1500_.jpg'
),
(
  'Toilet Bowl Cleaner',
  'Ecover',
  'Home Cleaning',
  'A plant-based toilet bowl cleaner made from sugarcane-derived ingredients. Free from chlorine bleach, phosphates, and synthetic fragrance. Biodegradable formula in a recyclable bottle.',
  'clean',
  83,
  'https://m.media-amazon.com/images/I/71YJ1jFSONL._AC_SL1500_.jpg'
),

-- Baby Care
(
  'Fragrance-Free Baby Wash & Shampoo',
  'Burt''s Bees Baby',
  'Baby Care',
  'A tear-free baby wash and shampoo made with 98.9% natural ingredients. Free from synthetic fragrance, parabens, phthalates, and sulfates. EWG Verified and pediatrician tested.',
  'clean',
  88,
  'https://m.media-amazon.com/images/I/71+7q+cdyWL._SL1500_.jpg'
),
(
  'Organic Diaper Rash Cream',
  'Earth Mama',
  'Baby Care',
  'A certified organic diaper cream made with non-nano zinc oxide and calendula to soothe and protect sensitive baby skin. Free from parabens, petroleum, and synthetic fragrance. Safe for cloth diapers.',
  'clean',
  90,
  'https://m.media-amazon.com/images/I/71KzXB188sL._AC_SL1500_.jpg'
),

-- Kitchen
(
  'Castile Dish Soap Bar',
  'Dr. Bronner''s',
  'Kitchen',
  'A concentrated, zero-waste dish soap bar made from certified fair-trade and organic coconut oil. Cuts grease effectively without synthetic surfactants, phosphates, or synthetic fragrance. Biodegradable.',
  'clean',
  95,
  'https://m.media-amazon.com/images/I/81Uoa7-YrKL._SL1500_.jpg'
),
(
  'Dish Soap Concentrate',
  'Blueland',
  'Kitchen',
  'A refillable, zero-waste dish soap made from plant-based ingredients. Free from synthetic fragrance, phosphates, parabens, and chlorine bleach. EWG Verified and EPA Safer Choice certified.',
  'clean',
  93,
  'https://m.media-amazon.com/images/I/81iPas+IoBL._AC_SL1500_.jpg'
),
(
  'Beeswax Food Wraps',
  'Bee''s Wrap',
  'Kitchen',
  'Reusable food wraps made from organic cotton, beeswax, tree resin, and coconut oil — a plastic-free alternative to cling wrap. No synthetic chemicals, BPA-free, and fully compostable.',
  'clean',
  96,
  'https://m.media-amazon.com/images/I/71g8oLa0+OL._AC_SL1500_.jpg'
);
