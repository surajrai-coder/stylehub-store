const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log(">>> MongoDB Connected Successfully! <<<"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 2. Product Schema (Strict category definition)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Required category
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  sizes: { type: [String], default: ["S", "M", "L", "XL", "XXL"] }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// 3. Order Schema
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerAddress: { type: String, required: true },
  items: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  utrNumber: { type: String, default: '' },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered!" });
    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    res.status(201).json({ message: "Registered!", user: { name: newUser.name, email: newUser.email, phone: newUser.phone } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: "Invalid Credentials!" });
    res.json({ message: "Login successful!", user: { name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, category, description, image, sizes } = req.body;
    const newProduct = new Product({
      name,
      price: Number(price),
      category: category || 'Oversized Tees',
      description,
      image,
      sizes: sizes || ["S", "M", "L", "XL", "XXL"]
    });
    await newProduct.save();
    console.log("Saved product with category:", newProduct.category);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Save error:", err);
    res.status(400).json({ error: "Product save failed" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

// --- Order Routes ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Fetch orders failed" });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (err) {
    res.status(400).json({ error: "Order failed" });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: "Status update failed" });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});