const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const slugify = require('slugify');

dotenv.config({ path: './.env' });
mongoose.connect(process.env.MONGO_URI);

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

const importData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();
        console.log('Database cleared.');

        let orderL1 = 1;
        for (const l1 of data) {
            const parentCat = await Category.create({
                name: l1.name,
                slug: makeSlug(l1.name),
                order: orderL1++
            });

            let orderL2 = 1;
            for (const l2 of l1.subcategories) {
                const subCat = await Category.create({
                    name: l2.name,
                    slug: makeSlug(l1.name + ' ' + l2.name),
                    parent: parentCat._id,
                    order: orderL2++
                });
                
                for (let i = 0; i < l2.items.length; i++) {
                    const productName = l2.items[i];
                    
                    // Directly create a Product for this item (No L3 Category)
                    await Product.create({
                        name: productName,
                        slug: makeSlug(l1.name + ' ' + l2.name + ' ' + productName),
                        description: `Premium ${productName} suitable for all your needs. Custom printed with high-quality materials. Get a pack of 100 at an economical price.`,
                        price: Math.floor(Math.random() * 500) + 50,
                        categories: [subCat._id, parentCat._id],
                        stock: 500,
                        images: [`https://via.placeholder.com/800x600?text=${encodeURIComponent(productName)}`]
                    });
                }
            }
        }
        
        console.log('Kraftix Data Imported successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

importData();
