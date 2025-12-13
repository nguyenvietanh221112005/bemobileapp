// controllers/index.js
const { ProductService, SaleService, OrderService, StatisticsService } = require('../service/adminService');

// ==================== PRODUCT CONTROLLER ====================
class ProductController {
  static async createProduct(req, res) {
    try {
      const result = await ProductService.createProduct(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductService.updateProduct(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductService.deleteProduct(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;
      const result = await ProductService.updateProductStatus(id, trang_thai);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAllProducts(req, res) {
  try {
    const { page = 1, limit = 10, danh_muc_id } = req.query;
    const result = await ProductService.getAllProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      danh_muc_id
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
}

// ==================== SALE CONTROLLER ====================
class SaleController {

  static async getAllSales(req, res) {
  try {
    const result = await SaleService.getAllSales();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}


  static async getSaleProducts(req, res) {
  try {
    const result = await SaleService.getSaleProducts();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

  static async createSale(req, res) {
    try {
      const result = await SaleService.createSale(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateSale(req, res) {
    try {
      const { id } = req.params;
      const result = await SaleService.updateSale(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteSale(req, res) {
    try {
      const { id } = req.params;
      const result = await SaleService.deleteSale(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

// ==================== ORDER CONTROLLER ====================
class OrderController {
  static async getAllOrders(req, res) {
    try {
      const result = await OrderService.getAllOrders();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;
      const result = await OrderService.updateOrderStatus(id, trang_thai);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // controllers/OrderController.js
static async getOrderDetail(req, res) {
  try {
    const { id } = req.params;
    const result = await OrderService.getOrderDetail(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

}

// ==================== STATISTICS CONTROLLER ====================
class StatisticsController {
  static async getOverview(req, res) {
    try {
      const result = await StatisticsService.getOverview();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const { limit } = req.query;
      const result = await StatisticsService.getTopProducts(limit ? parseInt(limit) : 10);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getRevenue(req, res) {
    try {
      const { start_date, end_date, group_by } = req.query;
      const result = await StatisticsService.getRevenue(start_date, end_date, group_by);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = {
  ProductController,
  SaleController,
  OrderController,
  StatisticsController
};