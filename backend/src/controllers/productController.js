// ──────────────────────────────────────────────
// Product Controller
// All handlers are async so swapping to a real
// PostgreSQL query later is a one-line change.
// ──────────────────────────────────────────────

const { products } = require('../data/mockDb');

/**
 * GET /api/products
 * Query params: ?search=...&sort=price_asc|price_desc|rating
 */
const getAllProducts = async (req, res) => {
  try {
    let result = [...products]; // shallow copy

    // ── Search filter ──────────────────────────
    const { search, sort } = req.query;

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // ── Sorting ────────────────────────────────
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllProducts, getProductById };
