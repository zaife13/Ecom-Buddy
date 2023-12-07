const {
  fetchProducts,
  fetchProductByASIN,
  fetchReviews,
} = require('../controllers/productController');

const express = require('express');
const router = express.Router();

router.get('/', fetchProducts);
router.get('/:asin', fetchProductByASIN);
router.get('/:asin/reviews', fetchReviews);

module.exports = router;
