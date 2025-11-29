const Order = require('../models/orderModel');

class OrderService {
  // Tạo đơn hàng
  async createOrder(nguoiDungId, diaChiId, ghiChu) {
    try {
      if (!diaChiId) {
        throw new Error('Vui lòng chọn địa chỉ giao hàng');
      }

      const donHangId = await Order.create(nguoiDungId, diaChiId, ghiChu);
      const order = await Order.getDetailById(donHangId, nguoiDungId);

      return {
        success: true,
        message: 'Đặt hàng thành công',
        data: order
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách đơn hàng theo trạng thái cụ thể (hiển thị riêng)
  async getOrdersByStatus(nguoiDungId, trangThai, page = 1, limit = 10) {
    try {
      const validStatuses = [
        'chờ xác nhận',
        'hoàn tất đặt hàng',
        'chuẩn bị',
        'đang giao hàng',
        'đã giao hàng',
        'đã hủy'
      ];

      if (!validStatuses.includes(trangThai)) {
        throw new Error('Trạng thái không hợp lệ');
      }

      const result = await Order.getByStatus(
        nguoiDungId,
        trangThai,
        parseInt(page),
        parseInt(limit)
      );

      return {
        success: true,
        data: {
          trang_thai: trangThai,
          don_hang: result.orders,
          pagination: result.pagination
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Chi tiết đơn hàng đầy đủ
  async getOrderDetail(donHangId, nguoiDungId) {
    try {
      const order = await Order.getDetailById(donHangId, nguoiDungId);

      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      return {
        success: true,
        data: order
      };
    } catch (error) {
      throw error;
    }
  }

  // Hủy đơn hàng
  async cancelOrder(donHangId, nguoiDungId) {
    try {
      await Order.cancel(donHangId, nguoiDungId);

      return {
        success: true,
        message: 'Hủy đơn hàng thành công'
      };
    } catch (error) {
      throw error;
    }
  }

  // Xác nhận giao hàng thành công
  async acceptDelivery(donHangId, nguoiDungId) {
    try {
      const order = await Order.getDetailById(donHangId, nguoiDungId);
      
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      if (order.trang_thai !== 'đang giao hàng') {
        throw new Error('Chỉ có thể xác nhận đơn hàng đang được giao');
      }

      await Order.updateStatus(donHangId, 'đã giao hàng', nguoiDungId);

      return {
        success: true,
        message: 'Xác nhận giao hàng thành công'
      };
    } catch (error) {
      throw error;
    }
  }

  // Thống kê số lượng đơn hàng theo từng trạng thái
  async getOrderStatistics(nguoiDungId) {
    try {
      const stats = await Order.countByStatus(nguoiDungId);
      
      const result = {
        'chờ xác nhận': 0,
        'hoàn tất đặt hàng': 0,
        'chuẩn bị': 0,
        'đang giao hàng': 0,
        'đã giao hàng': 0,
        'đã hủy': 0
      };

      stats.forEach(stat => {
        result[stat.trang_thai] = stat.so_luong;
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();