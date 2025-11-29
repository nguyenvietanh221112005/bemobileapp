// services/index.js
const { ProductModel, SaleModel, OrderModel, StatisticsModel } = require('../models/adminModel');

// ==================== PRODUCT SERVICE ====================
class ProductService {
  static async createProduct(productData) {
    try {
      if (!productData.ten || !productData.gia) {
        throw new Error('Thiếu thông tin bắt buộc');
      }

      const productId = await ProductModel.create(productData);
      return {
        success: true,
        message: 'Thêm sản phẩm thành công',
        data: { id: productId }
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(id, productData) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      const affectedRows = await ProductModel.update(id, productData);
      
      if (affectedRows === 0) {
        throw new Error('Cập nhật thất bại');
      }

      return {
        success: true,
        message: 'Cập nhật sản phẩm thành công'
      };
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      const affectedRows = await ProductModel.delete(id);
      
      if (affectedRows === 0) {
        throw new Error('Xóa thất bại');
      }

      return {
        success: true,
        message: 'Xóa sản phẩm thành công'
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateProductStatus(id, status) {
    try {
      const validStatuses = ['còn hàng', 'hết hàng'];
      if (!validStatuses.includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
      }

      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      const affectedRows = await ProductModel.updateStatus(id, status);
      
      if (affectedRows === 0) {
        throw new Error('Cập nhật trạng thái thất bại');
      }

      return {
        success: true,
        message: 'Cập nhật trạng thái thành công',
        data: { status }
      };
    } catch (error) {
      throw error;
    }
  }
}

// ==================== SALE SERVICE ====================
class SaleService {
  static async createSale(saleData) {
    try {
      if (!saleData.san_pham_id || !saleData.loai || !saleData.gia_tri) {
        throw new Error('Thiếu thông tin bắt buộc');
      }

      const validTypes = ['percent', 'fixed'];
      if (!validTypes.includes(saleData.loai)) {
        throw new Error('Loại giảm giá không hợp lệ');
      }

      const saleId = await SaleModel.create(saleData);
      return {
        success: true,
        message: 'Thêm giảm giá thành công',
        data: { id: saleId }
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateSale(id, saleData) {
    try {
      const sale = await SaleModel.findById(id);
      if (!sale) {
        throw new Error('Giảm giá không tồn tại');
      }

      const validTypes = ['percent', 'fixed'];
      if (saleData.loai && !validTypes.includes(saleData.loai)) {
        throw new Error('Loại giảm giá không hợp lệ');
      }

      const affectedRows = await SaleModel.update(id, saleData);
      
      if (affectedRows === 0) {
        throw new Error('Cập nhật thất bại');
      }

      return {
        success: true,
        message: 'Cập nhật giảm giá thành công'
      };
    } catch (error) {
      throw error;
    }
  }

  static async deleteSale(id) {
    try {
      const sale = await SaleModel.findById(id);
      if (!sale) {
        throw new Error('Giảm giá không tồn tại');
      }

      const affectedRows = await SaleModel.delete(id);
      
      if (affectedRows === 0) {
        throw new Error('Xóa thất bại');
      }

      return {
        success: true,
        message: 'Xóa giảm giá thành công'
      };
    } catch (error) {
      throw error;
    }
  }
}

// ==================== ORDER SERVICE ====================
class OrderService {
  static async getAllOrders() {
    try {
      const orders = await OrderModel.getAll();
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(id, status) {
    try {
      const validStatuses = [
        'chờ xác nhận',
        'hoàn tất đặt hàng',
        'chuẩn bị',
        'đang giao hàng',
        'đã giao hàng',
        'hủy đơn'
      ];

      if (!validStatuses.includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
      }

      const order = await OrderModel.findById(id);
      if (!order) {
        throw new Error('Đơn hàng không tồn tại');
      }

      const affectedRows = await OrderModel.updateStatus(id, status);
      
      if (affectedRows === 0) {
        throw new Error('Cập nhật trạng thái thất bại');
      }

      return {
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: { status }
      };
    } catch (error) {
      throw error;
    }
  }
}

// ==================== STATISTICS SERVICE ====================
class StatisticsService {
  static async getOverview() {
    try {
      const overview = await StatisticsModel.getOverview();
      return {
        success: true,
        data: overview
      };
    } catch (error) {
      throw error;
    }
  }

  static async getTopProducts(limit) {
    try {
      const products = await StatisticsModel.getTopProducts(limit);
      return {
        success: true,
        data: products
      };
    } catch (error) {
      throw error;
    }
  }

  static async getRevenue(startDate, endDate, groupBy) {
    try {
      if (!startDate || !endDate) {
        throw new Error('Thiếu thông tin ngày bắt đầu hoặc kết thúc');
      }

      const validGroupBy = ['day', 'month', 'year'];
      if (groupBy && !validGroupBy.includes(groupBy)) {
        throw new Error('Loại thống kê không hợp lệ');
      }

      const revenue = await StatisticsModel.getRevenue(startDate, endDate, groupBy || 'day');
      return {
        success: true,
        data: revenue
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  ProductService,
  SaleService,
  OrderService,
  StatisticsService
};