const express = require('express');
const { protect } = require('../controllers/authController');
const { addSupplier, getSuppliers, removeSupplier } = require('../controllers/supplierController');
const router = express.Router();

router.post('/addSupplier', protect, addSupplier);
router.get('/getSuppliers', protect, getSuppliers);
router.delete('/:supplierId', protect, removeSupplier);
module.exports = router;
