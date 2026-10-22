require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Product = require('../models/Product');

const seedProducts = [
  // --- ELECTRONICS ---
  {
    sku: 'SSP-ELEC-001',
    name: 'Acoustic Studio Wireless Headphones',
    description: 'Precision-engineered over-ear headphones crafted with anodized aluminum, memory foam lambskin cushions, and custom 40mm beryllium acoustic drivers for studio-grade acoustic clarity.',
    category: 'Electronics',
    price: 18999,
    originalPrice: 24999,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: true,
    isNewArrival: false,
    rating: 4.9,
    numReviews: 48,
    specs: [
      { label: 'Battery Life', value: '38 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm Aux' },
      { label: 'Noise Cancellation', value: 'Adaptive Hybrid ANC' },
      { label: 'Weight', value: '254g' }
    ],
    tags: ['audio', 'wireless', 'headphones', 'minimalist', 'noise-cancelling']
  },
  {
    sku: 'SSP-ELEC-002',
    name: 'Craftsman Mechanical Keyboard',
    description: 'Solid milled walnut chassis with gasket-mounted pre-lubed tactile switches, PBT dye-sublimated keycaps, and hot-swappable PCB for tactile typing perfection.',
    category: 'Electronics',
    price: 12499,
    originalPrice: 15999,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: false,
    isNewArrival: true,
    rating: 4.8,
    numReviews: 32,
    specs: [
      { label: 'Form Factor', value: '75% Compact Layout' },
      { label: 'Switches', value: 'Gateron Oil King (Factory Lubed)' },
      { label: 'Case Material', value: 'Solid American Walnut & Brass' },
      { label: 'Connection', value: 'Tri-mode (Type-C, 2.4GHz, BT 5.0)' }
    ],
    tags: ['keyboard', 'desksetup', 'mechanical', 'woodcraft']
  },
  {
    sku: 'SSP-ELEC-003',
    name: 'Vessel Ambient Desk Light & Speaker',
    description: 'A harmonious fusion of warm incandescent ambient illumination and high-fidelity 360-degree sound. Cast from satin-finished aluminum with a hand-blown fluted glass cylinder.',
    category: 'Electronics',
    price: 8999,
    originalPrice: 11999,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: true,
    rating: 4.7,
    numReviews: 19,
    specs: [
      { label: 'Color Temp', value: '2200K - 3200K Stepless Dimming' },
      { label: 'Audio Power', value: '15W RMS Neodymium Driver' },
      { label: 'Battery Life', value: '14 hours illumination & playback' }
    ],
    tags: ['lighting', 'speaker', 'ambient', 'smart-home']
  },
  {
    sku: 'SSP-ELEC-004',
    name: 'Horizon Minimalist Smart Watch',
    description: 'Understated elegance meeting discreet intelligence. Sapphire crystal display with ceramic bezel, heart-rate monitoring, and an uncompressed 7-day battery endurance.',
    category: 'Electronics',
    price: 15499,
    originalPrice: 19999,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: false,
    rating: 4.6,
    numReviews: 27,
    specs: [
      { label: 'Display', value: '1.39" AMOLED 454x454' },
      { label: 'Water Resistance', value: '5 ATM (50 meters)' },
      { label: 'Strap', value: 'Top-grain Italian Calfskin' }
    ],
    tags: ['wearables', 'smartwatch', 'minimalist', 'fitness']
  },
  {
    sku: 'SSP-ELEC-005',
    name: 'Aero Magnetic Wireless Charging Pad',
    description: 'Machined from a single block of aerospace-grade aluminum with a tactile matte Italian leather resting surface. Fast charges three devices simultaneously.',
    category: 'Electronics',
    price: 4999,
    originalPrice: 6499,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: true,
    rating: 4.5,
    numReviews: 14,
    specs: [
      { label: 'Max Output', value: '15W MagSafe + 15W Qi + 5W Watch' },
      { label: 'Finish', value: 'Space Grey Aluminum & Saddle Leather' }
    ],
    tags: ['charger', 'accessories', 'tech', 'desk']
  },
  {
    sku: 'SSP-ELEC-006',
    name: 'Monolith High-Res Audio DAC & Amp',
    description: 'Audiophile-grade digital-to-analog converter that extracts every hidden detail from your digital audio library. ESS Sabre ES9038Q2M architecture.',
    category: 'Electronics',
    price: 10999,
    originalPrice: 13999,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: false,
    rating: 4.9,
    numReviews: 11,
    specs: [
      { label: 'Decoding', value: 'Up to 32-bit/768kHz PCM & DSD512' },
      { label: 'Outputs', value: '4.4mm Balanced & 6.35mm Single-ended' }
    ],
    tags: ['audio', 'dac', 'audiophile', 'hifi']
  },

  // --- FASHION ---
  {
    sku: 'SSP-FASH-001',
    name: 'Raw Silk Relaxed Overshirt',
    description: 'Tailored from raw undyed mulberry silk and organic linen blend. Features horn buttons, dropped shoulders, and a clean structured drape suitable for all seasons.',
    category: 'Fashion',
    price: 6499,
    originalPrice: 8999,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 38,
    specs: [
      { label: 'Material', value: '60% Raw Silk, 40% Organic Linen' },
      { label: 'Fit', value: 'Relaxed Tailored Silhouette' },
      { label: 'Care', value: 'Dry Clean or Gentle Cold Handwash' }
    ],
    tags: ['apparel', 'silk', 'linen', 'minimalist', 'overshirt']
  },
  {
    sku: 'SSP-FASH-002',
    name: 'Merino Wool Architectural Turtleneck',
    description: 'Spun from ultra-fine 19.5-micron Australian merino wool with a subtle ribbed knit collar and seamless 3D knit construction for zero-friction movement.',
    category: 'Fashion',
    price: 5499,
    originalPrice: 7299,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 24,
    specs: [
      { label: 'Material', value: '100% Extra-fine Merino Wool' },
      { label: 'Origin', value: 'Milled in Biella, Italy' }
    ],
    tags: ['knitwear', 'wool', 'winter', 'turtleneck']
  },
  {
    sku: 'SSP-FASH-003',
    name: 'Tailored Japanese Denim Trousers',
    description: '13oz selvedge denim woven in Okayama on vintage shuttle looms. Features a high-rise waist, deep single pleat, and clean tapered hem.',
    category: 'Fashion',
    price: 7999,
    originalPrice: 9999,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: false,
    isNewArrival: false,
    rating: 4.7,
    numReviews: 21,
    specs: [
      { label: 'Fabric', value: '13oz Okayama Selvedge Denim' },
      { label: 'Details', value: 'Solid brass zip fly & copper rivets' }
    ],
    tags: ['denim', 'jeans', 'selvedge', 'japan']
  },
  {
    sku: 'SSP-FASH-004',
    name: 'Heritage Chore Jacket in Heavy Canvas',
    description: 'Built from 380gsm washed cotton duck canvas with triple-needle stitching, corduroy-lined collar, and brass shank buttons. Gets softer with every wear.',
    category: 'Fashion',
    price: 6999,
    originalPrice: 8999,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: true,
    rating: 4.8,
    numReviews: 29,
    specs: [
      { label: 'Material', value: '100% Heavyweight Cotton Canvas' },
      { label: 'Pockets', value: '4 Functional patch pockets' }
    ],
    tags: ['outerwear', 'jacket', 'chore', 'workwear']
  },
  {
    sku: 'SSP-FASH-005',
    name: 'Handcrafted Chelsea Boots in Waxed Suede',
    description: 'Goodyear welted Chelsea boot built on an almond toe last. Water-repellent waxed reverse calf suede with resilient Vibram rubber outsoles.',
    category: 'Fashion',
    price: 11999,
    originalPrice: 14999,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: false,
    rating: 4.9,
    numReviews: 33,
    specs: [
      { label: 'Construction', value: 'Goodyear Welted (Recraftable)' },
      { label: 'Sole', value: 'Vibram Commando Studded Rubber' }
    ],
    tags: ['footwear', 'boots', 'suede', 'leather']
  },
  {
    sku: 'SSP-FASH-006',
    name: 'Cashmere Ribbed Beanie & Scarf Set',
    description: 'Pure Mongolian 4-ply cashmere with tactile fisherman rib knit. Unbelievably soft warmth without bulk.',
    category: 'Fashion',
    price: 4499,
    originalPrice: 5999,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: true,
    rating: 4.6,
    numReviews: 15,
    specs: [
      { label: 'Material', value: '100% Grade-A Mongolian Cashmere' }
    ],
    tags: ['accessories', 'winter', 'cashmere', 'scarf']
  },

  // --- HOME & LIVING ---
  {
    sku: 'SSP-HOME-001',
    name: 'Artisan Ceramic Pour-Over & Server',
    description: 'Wheel-thrown speckled stoneware finished in a semi-matte raw chalk glaze. Designed for optimal water turbulence and maximum extraction consistency.',
    category: 'Home & Living',
    price: 3499,
    originalPrice: 4499,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: true,
    isNewArrival: false,
    rating: 4.9,
    numReviews: 52,
    specs: [
      { label: 'Capacity', value: '650ml (Serves 2-3 cups)' },
      { label: 'Material', value: 'High-fire Stoneware' },
      { label: 'Compatibility', value: 'V60 size 02 filters' }
    ],
    tags: ['coffee', 'ceramics', 'kitchen', 'stoneware']
  },
  {
    sku: 'SSP-HOME-002',
    name: 'Sculptural Cast Travertine Table Lamp',
    description: 'Carved from solid Italian beige travertine stone with natural porous texture, topped with a raw linen drum shade. Radiates warm architectural serenity.',
    category: 'Home & Living',
    price: 13999,
    originalPrice: 17999,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: false,
    isNewArrival: true,
    rating: 5.0,
    numReviews: 17,
    specs: [
      { label: 'Base', value: 'Solid Honed Italian Travertine' },
      { label: 'Shade', value: '100% Belgian Oatmeal Linen' },
      { label: 'Height', value: '46 cm' }
    ],
    tags: ['lighting', 'furniture', 'travertine', 'sculptural']
  },
  {
    sku: 'SSP-HOME-003',
    name: 'Washed Belgian Linen Duvet Set',
    description: 'Pre-washed with volcanic pumice for exceptional softness from night one. Naturally temperature-regulating, hypoallergenic, and gets more supple over time.',
    category: 'Home & Living',
    price: 8499,
    originalPrice: 10999,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 41,
    specs: [
      { label: 'Set Includes', value: '1 King Duvet Cover + 2 Pillow Shams' },
      { label: 'Material', value: '100% Certified Flax Linen (175 GSM)' }
    ],
    tags: ['bedding', 'linen', 'bedroom', 'comfort']
  },
  {
    sku: 'SSP-HOME-004',
    name: 'Solid Walnut Pedestal Fruit Bowl',
    description: 'Turned on a lathe from a single salvage black walnut trunk with organic oil and beeswax food-safe finish. An eye-catching organic centerpiece.',
    category: 'Home & Living',
    price: 4299,
    originalPrice: 5499,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: true,
    rating: 4.7,
    numReviews: 12,
    specs: [
      { label: 'Diameter', value: '30 cm' },
      { label: 'Wood', value: 'Sustainably Harvested American Walnut' }
    ],
    tags: ['decor', 'woodwork', 'dining', 'centerpiece']
  },
  {
    sku: 'SSP-HOME-005',
    name: 'Nordic Merino Wool Woven Throw Blanket',
    description: 'Woven with a rich herringbone pattern from 100% pure Scandinavian new wool. Finished with tactile twisted fringes.',
    category: 'Home & Living',
    price: 3899,
    originalPrice: 4999,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 28,
    specs: [
      { label: 'Dimensions', value: '130 x 180 cm' },
      { label: 'Weight', value: '950g' }
    ],
    tags: ['throw', 'wool', 'blanket', 'livingroom']
  },
  {
    sku: 'SSP-HOME-006',
    name: 'Handblown Ribbed Glass Carafe Set',
    description: 'Borosilicate glassware blown by master glassmakers with slender vertical fluting. Includes matching drinking glass that nests neatly as a dust lid.',
    category: 'Home & Living',
    price: 2499,
    originalPrice: 3299,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: false,
    rating: 4.6,
    numReviews: 16,
    specs: [
      { label: 'Carafe Volume', value: '850 ml' },
      { label: 'Glass Volume', value: '250 ml' }
    ],
    tags: ['glassware', 'tableware', 'carafe', 'nightstand']
  },

  // --- ACCESSORIES ---
  {
    sku: 'SSP-ACCS-001',
    name: 'Bespoke Vegetable-Tanned Bifold Wallet',
    description: 'Cut from legendary Buttero leather from Conceria Walpier in Tuscany. Hand-stitched with waxed linen thread and hand-burnished beeswax edges.',
    category: 'Accessories',
    price: 3299,
    originalPrice: 4299,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: true,
    isNewArrival: false,
    rating: 4.9,
    numReviews: 64,
    specs: [
      { label: 'Leather', value: 'Italian Full-Grain Buttero Vachetta' },
      { label: 'Capacity', value: '8 Cards + Full Currency Pocket' },
      { label: 'Stitching', value: 'Saddle-Stitched by Hand' }
    ],
    tags: ['wallet', 'leather', 'handcrafted', 'everyday-carry']
  },
  {
    sku: 'SSP-ACCS-002',
    name: 'Bauhaus Chronograph with Milanese Mesh',
    description: 'Celebrates minimalist geometric restraint. 38mm brushed 316L stainless steel case with domed anti-reflective sapphire crystal and Japanese Mecha-Quartz movement.',
    category: 'Accessories',
    price: 13499,
    originalPrice: 16999,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isTrending: false,
    isNewArrival: true,
    rating: 4.8,
    numReviews: 31,
    specs: [
      { label: 'Case Diameter', value: '38 mm' },
      { label: 'Thickness', value: '9.8 mm' },
      { label: 'Movement', value: 'Seiko VK64 Meca-Quartz Hybrid' },
      { label: 'Water Resistance', value: '5 ATM' }
    ],
    tags: ['watch', 'horology', 'bauhaus', 'minimalist']
  },
  {
    sku: 'SSP-ACCS-003',
    name: 'Handcrafted Acetate Sunglasses in Tortoiseshell',
    description: 'Milled from 8mm Japanese cellulose acetate blocks with barrel hinges and scratch-resistant green CR-39 lenses with 100% UVA/UVB polarization.',
    category: 'Accessories',
    price: 6499,
    originalPrice: 8499,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: false,
    rating: 4.7,
    numReviews: 22,
    specs: [
      { label: 'Frame', value: 'Japanese Mazzucchelli Acetate' },
      { label: 'Lenses', value: 'Category 3 Polarized CR-39' }
    ],
    tags: ['eyewear', 'sunglasses', 'acetate', 'summer']
  },
  {
    sku: 'SSP-ACCS-004',
    name: 'Overnight Weekender in Waxed Twill & Leather',
    description: 'Heavy 18oz Scottish waxed cotton twill paired with bridle leather straps. Complies with international airline carry-on standards.',
    category: 'Accessories',
    price: 9999,
    originalPrice: 12999,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 18,
    specs: [
      { label: 'Volume', value: '38 Liters' },
      { label: 'Hardware', value: 'Solid Cast Antiqued Brass' }
    ],
    tags: ['travel', 'bag', 'weekender', 'luggage']
  },
  {
    sku: 'SSP-ACCS-005',
    name: 'Solid Brass Geometric Pen & Desk Stand',
    description: 'Precision CNC-machined from untreated solid brass. Naturally acquires a distinct antique patina over years of use. Uses Schmidt rollerball refills.',
    category: 'Accessories',
    price: 2999,
    originalPrice: 3899,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: false,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 14,
    specs: [
      { label: 'Weight', value: '185g (Pen + Base)' },
      { label: 'Refill', value: 'Schmidt Safety Ceramic Roller 888' }
    ],
    tags: ['stationery', 'desk', 'brass', 'writing']
  },
  {
    sku: 'SSP-ACCS-006',
    name: 'Modular Leather Tech & Cable Folio',
    description: 'Organize chargers, cables, earbuds, and accessories in a structured zip portfolio crafted from supple pebbled full-grain leather.',
    category: 'Accessories',
    price: 3799,
    originalPrice: 4799,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&auto=format&fit=crop&q=80'
    ],
    featured: false,
    isTrending: true,
    isNewArrival: false,
    rating: 4.6,
    numReviews: 20,
    specs: [
      { label: 'Dimensions', value: '24 x 16 x 5 cm' },
      { label: 'Lining', value: 'Microsuede with elastic retention straps' }
    ],
    tags: ['organizer', 'tech', 'leather', 'travel']
  }
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log(`[Seed] Processing ${seedProducts.length} curated products via non-destructive upsert...`);

    const operations = seedProducts.map((product) => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { $set: product },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(operations);

    console.log(`[Seed] Idempotent upsert completed successfully!`);
    console.log(`  - Upserted (New): ${result.upsertedCount}`);
    console.log(`  - Modified: ${result.modifiedCount}`);
    console.log(`  - Matched: ${result.matchedCount}`);
    console.log(`[Seed] Verified: Zero customer data or previous collections were wiped.`);

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed products: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
