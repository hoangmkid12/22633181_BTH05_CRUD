require('dotenv').config();
const mongoose = require('mongoose');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  await Supplier.deleteMany({});
  await Product.deleteMany({});

  const s1 = await Supplier.create({ name: 'Acme Corp', address: '1 Main St', phone: '123456789' });
  const s2 = await Supplier.create({ name: 'Global Goods', address: '22 Market Ave', phone: '987654321' });

  await Product.create([
    { name: 'Notebook', price: 4.5, quantity: 100, supplierId: s1._id },
    { name: 'Pen', price: 1.2, quantity: 300, supplierId: s1._id },
    { name: 'Backpack', price: 25, quantity: 40, supplierId: s2._id }
  ]);

  console.log('Seeded!');
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
