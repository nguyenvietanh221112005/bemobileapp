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
router.get('/products', ProductController.getAllProducts);
router.post('/product', ProductController.createProduct);
router.put('/product/:id', ProductController.updateProduct);
router.delete('/product/:id', ProductController.deleteProduct);
router.put('/product/status/:id', ProductController.updateStatus);

// ========== QUẢN LÝ GIẢM GIÁ ==========
router.get('/products-sale', SaleController.getSaleProducts);
router.get('/sales', SaleController.getAllSales);
router.post('/sale', SaleController.createSale);
router.put('/sale/:id', SaleController.updateSale);
router.delete('/sale/:id', SaleController.deleteSale);

// ========== QUẢN LÝ ĐƠN HÀNG ==========

router.get('/orders/:id', OrderController.getOrderDetail);

router.get('/orders', OrderController.getAllOrders);
router.put('/orders/update-status/:id', OrderController.updateStatus);

// ========== THỐNG KÊ ==========
router.get('/statistics/overview', StatisticsController.getOverview);
router.get('/statistics/top-products', StatisticsController.getTopProducts);
router.get('/statistics/revenue', StatisticsController.getRevenue);

module.exports = router;