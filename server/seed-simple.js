const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const fs = require('fs');

dotenv.config({ path: './.env' });

const logFile = 'seed-log.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

const data = [
  {
    name: 'Sticker/Labels',
    subcategories: [
      {
        name: 'Stickers by Shape',
        items: ['Custom Round Sticker', 'Square & Rectangle Stickers', 'Custom Shape Stickers', 'Oval Stickers']
      },
      {
        name: 'Stickers by Material',
        items: ['3D Raised & Embossed UV Stickers', 'Ink Transfer Stickers', 'Metal Stickers']
      },
      {
        name: 'Stickers by Use',
        items: ['Address Labels', 'Candle Labels', 'Bottle & Jar Labels']
      },
      {
        name: 'Exclusive Stickers',
        items: ['Holographic Stickers', 'Premium Vinyl']
      },
      {
        name: 'Transfer Stickers',
        items: ['DTF Transfer Stickers (for Fabrics)']
      }
    ]
  },
  {
    name: 'Packaging',
    subcategories: [
      {
        name: 'Paper Bags & Pouch',
        items: ['Paper Bags', 'Premium Paper Bags', 'D Cut Handle Bags']
      },
      {
        name: 'Boxes',
        items: ['Custom Paper Boxes', 'Tuck Top Box', 'Kraft Paper Product Box']
      },
      {
        name: 'Custom Courier Bags',
        items: ['Black Custom Courier Poly Bags', 'Custom Bubble Courier Envelope']
      },
      {
        name: 'Tapes',
        items: ['Transparent Printed Tape', 'Brown Printed Tape']
      },
      {
        name: 'Thank You Cards',
        items: ['Flat Thank You Cards', 'Spot UV Thank You Cards']
      }
    ]
  },
  {
    name: 'Cards/Stationery',
    subcategories: [
      {
        name: 'Business Cards',
        items: ['Standard Business Cards', 'Raised Spot-UV Business Card']
      },
      {
        name: 'Letterheads',
        items: ['Luxury Letterheads']
      },
      {
        name: 'Envelopes',
        items: ['Rigid Envelope', 'Key Card Paper Sleeves']
      }
    ]
  },
  {
    name: 'Marketing',
    subcategories: [
      {
        name: 'Posters',
        items: ['Custom Posters', 'Danglers', 'Wall Stickers']
      },
      {
        name: 'Signs & Display',
        items: ['Car Magnet Stickers', 'Foam Board Signs', 'Premium Banners']
      },
      {
        name: 'Brochures',
        items: ['Tri-fold Brochure', 'Bi-fold Brochure']
      }
    ]
  },
  {
    name: 'Industry',
    subcategories: [
      {
        name: 'Restaurant, Bakery, Kitchen & Cafe',
        items: ['Food Box/Container Labels', 'Edge Seal Stickers (F&B)']
      },
      {
        name: 'Packed Food & Beverage',
        items: ['Glass Bottle Labels', 'Coffee/Tea Labels']
      },
      {
        name: 'Health & Beauty',
        items: ['Soap Boxes', 'Water & Oil Proof Labels(H&B)']
      }
    ]
  }
];

const makeSlug = (str) => slugify(str, { lower: true, strict: true, remove: /[*+~.()'"!:@&]/g });

async function seed() {
    try {
        fs.writeFileSync(logFile, 'SEEDING CALLED\n');
        log('Connecting to: ' + process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to MongoDB.');

        // Get models directly (Defining schemas to be safe if dist is missing)
        const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
            name: { type: String, required: true },
            slug: { type: String, unique: true },
            parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
            order: Number,
            isActive: { type: Boolean, default: true }
        }));

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
            name: { type: String, required: true },
            slug: { type: String, unique: true },
            description: String,
            price: Number,
            categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
            stock: { type: Number, default: 0 },
            isActive: { type: Boolean, default: true },
            isDeleted: { type: Boolean, default: false },
            images: [String]
        }));

        log('Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        log('Database cleared.');

        for (const l1 of data) {
            log('Seeding parent: ' + l1.name);
            const parentCat = await Category.create({
                name: l1.name,
                slug: makeSlug(l1.name),
                order: 0
            });

            for (const l2 of l1.subcategories) {
                log('  Seeding sub: ' + l2.name);
                const subCat = await Category.create({
                    name: l2.name,
                    slug: makeSlug(l2.name), // Simpler slugs to avoid mismatch
                    parent: parentCat._id,
                    order: 0
                });

                for (const productName of l2.items) {
                    await Product.create({
                        name: productName,
                        slug: makeSlug(productName),
                        description: `Premium ${productName}. Custom high-quality results.`,
                        price: Math.floor(Math.random() * 500) + 100,
                        categories: [subCat._id, parentCat._id],
                        stock: 1000,
                        images: [`https://via.placeholder.com/800?text=${encodeURIComponent(productName)}`]
                    });
                }
            }
        }

        log('SEEDING COMPLETE!');
        process.exit(0);
    } catch (err) {
        log('FATAL ERROR: ' + err.message);
        process.exit(1);
    }
}

seed();
