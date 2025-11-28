const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// ========== DANH MỤC ==========
// GET /category - Lấy tất cả danh mục
router.get('/', CategoryController.getAllCategories);

// GET /category/:id/products - Lấy sản phẩm theo danh mục
router.get('/:id/products', CategoryController.getProductsByCategory);

// ========== SẢN PHẨM ==========
// QUAN TRỌNG: Route cụ thể phải đặt TRƯỚC route động (:id)

// GET /products/search?q=... - Tìm kiếm sản phẩm
router.get('/products/search', CategoryController.searchProducts);

// GET /products/sale - Lấy sản phẩm đang giảm giá
router.get('/products/sale', CategoryController.getProductsOnSale);

// GET /products?sort=popular&sale=true - Lấy sản phẩm trang chủ
router.get('/products', CategoryController.getHomeProducts);

// GET /products/:id - Lấy chi tiết sản phẩm (phải đặt cuối cùng)
router.get('/products/:id', CategoryController.getProductById);


module.exports = router;