// ──────────────────────────────────────────────
// Server Entry Point
// ──────────────────────────────────────────────

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// ── Health Check ──────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'AURA Clothing Store API is running 🚀',
    endpoints: {
      products: '/api/products',
      product: '/api/products/:id',
      register: '/api/auth/register',
      login: '/api/auth/login',
    },
  });
});

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  Server running on http://localhost:${PORT}\n`);
});
