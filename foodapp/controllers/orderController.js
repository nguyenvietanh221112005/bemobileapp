const orderService = require('../service/orderService');

class OrderController {
  // POST /order - Tạo đơn hàng mới
  async createOrder(req, res) {
    try {
      const { nguoi_dung_id, dia_chi_id, ghi_chu } = req.body;

      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin nguoi_dung_id'
        });
      }

      const result = await orderService.createOrder(nguoi_dung_id, dia_chi_id, ghi_chu);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /order/status/:status - Lấy danh sách đơn hàng theo trạng thái cụ thể
  // Ví dụ: /order/status/chờ xác nhận?page=1&limit=10
  async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const { nguoi_dung_id } = req.query;
      const { page = 1, limit = 10 } = req.query;

      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin nguoi_dung_id'
        });
      }

      // Decode URL-encoded status (để xử lý trạng thái có khoảng trắng)
      const decodedStatus = decodeURIComponent(status);

      const result = await orderService.getOrdersByStatus(
        nguoi_dung_id,
        decodedStatus,
        page,
        limit
      );

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /order/statistics - Thống kê số lượng đơn hàng theo trạng thái
  async getOrderStatistics(req, res) {
    try {
      const { nguoi_dung_id } = req.query;

      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin nguoi_dung_id'
        });
      }

      const result = await orderService.getOrderStatistics(nguoi_dung_id);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /order/:id - Chi tiết đơn hàng đầy đủ
  async getOrderDetail(req, res) {
    try {
      const { id } = req.params;
      const { nguoi_dung_id } = req.query;

      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin nguoi_dung_id'
        });
      }

      const result = await orderService.getOrderDetail(id, nguoi_dung_id);

      res.json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /order/cancel/:id - Hủy đơn hàng
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const { nguoi_dung_id } = req.body;

      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin nguoi_dung_id'
        });
      }

      const result = await orderService.cancelOrder(id, nguoi_dung_id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /order/accept/:id - Xác nhận giao hàng thành công
  async acceptDelivery(req, res) {
    try {
      const { id } = req.params;
      const { nguoi_dung_id } = req.body;

      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin nguoi_dung_id'
        });
      }

      const result = await orderService.acceptDelivery(id, nguoi_dung_id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new OrderController();