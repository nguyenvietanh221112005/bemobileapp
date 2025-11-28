const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /order - Tạo đơn hàng mới
router.post('/', (req, res) => orderController.createOrder(req, res));

// GET /order/history - Lấy lịch sử đơn hàng (có thể filter theo trạng thái)
// Query params: ?trang_thai=đang giao hàng&page=1&limit=10
router.get('/history', (req, res) => orderController.getOrderHistory(req, res));

// GET /order/statistics - Thống kê số lượng đơn hàng theo trạng thái
router.get('/statistics', (req, res) => orderController.getOrderStatistics(req, res));

// GET /order/:id - Chi tiết một đơn hàng
router.get('/:id', (req, res) => orderController.getOrderDetail(req, res));

// PUT /order/cancel/:id - Hủy đơn hàng (chỉ khi ở trạng thái "chờ xác nhận" hoặc "hoàn tất đặt hàng")
router.put('/cancel/:id', (req, res) => orderController.cancelOrder(req, res));

// PUT /order/accept/:id - Xác nhận đã nhận hàng (chỉ khi ở trạng thái "đang giao hàng")
router.put('/accept/:id', (req, res) => orderController.acceptDelivery(req, res));

module.exports = router;