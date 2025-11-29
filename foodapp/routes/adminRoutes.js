// routes/index.js
const express = require('express');
const router = express.Router();

const { 
  ProductController, 
  SaleController, 
  OrderController, 
  StatisticsController 
} = require('../controllers/adminController');

// ========== QUẢN LÝ SẢN PHẨM ==========
router.post('/product', ProductController.createProduct);
router.put('/product/:id', ProductController.updateProduct);
router.delete('/product/:id', ProductController.deleteProduct);
router.put('/product/status/:id', ProductController.updateStatus);

// ========== QUẢN LÝ GIẢM GIÁ ==========
router.post('/sale', SaleController.createSale);
router.put('/sale/:id', SaleController.updateSale);
router.delete('/sale/:id', SaleController.deleteSale);

// ========== QUẢN LÝ ĐƠN HÀNG ==========
router.get('/orders', OrderController.getAllOrders);
router.put('/orders/update-status/:id', OrderController.updateStatus);

// ========== THỐNG KÊ ==========
router.get('/statistics/overview', StatisticsController.getOverview);
router.get('/statistics/top-products', StatisticsController.getTopProducts);
router.get('/statistics/revenue', StatisticsController.getRevenue);

module.exports = router;