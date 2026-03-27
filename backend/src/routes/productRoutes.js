const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

// GET  /api/products         → list + search + sort
// GET  /api/products/:id     → single product
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
