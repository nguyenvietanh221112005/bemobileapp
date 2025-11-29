const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /order - Tạo đơn hàng mới
router.post('/', (req, res) => orderController.createOrder(req, res));

// GET /order/statistics - Thống kê số lượng đơn hàng theo trạng thái
// Query: ?nguoi_dung_id=1
router.get('/statistics', (req, res) => orderController.getOrderStatistics(req, res));

// GET /order/status/:status - Lấy danh sách đơn hàng theo trạng thái cụ thể
// Ví dụ: 
// - /order/status/chờ xác nhận?nguoi_dung_id=1&page=1&limit=10
// - /order/status/đang giao hàng?nguoi_dung_id=1
// - /order/status/đã giao hàng?nguoi_dung_id=1
router.get('/status/:status', (req, res) => orderController.getOrdersByStatus(req, res));

// GET /order/:id - Chi tiết đơn hàng (đầy đủ thông tin sản phẩm và địa chỉ)
// Query: ?nguoi_dung_id=1
router.get('/:id', (req, res) => orderController.getOrderDetail(req, res));

// PUT /order/cancel/:id - Hủy đơn hàng
router.put('/cancel/:id', (req, res) => orderController.cancelOrder(req, res));

// PUT /order/accept/:id - Xác nhận đã nhận hàng
router.put('/accept/:id', (req, res) => orderController.acceptDelivery(req, res));

module.exports = router;