const cartService = require('../service/cartSercvice');

class CartController {
  // GET /cart/:nguoi_dung_id - Lấy giỏ hàng
  async getCart(req, res) {
    try {
      const nguoiDungId = req.params.nguoi_dung_id;
      
      if (!nguoiDungId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin người dùng'
        });
      }
      
      const cart = await cartService.getCart(nguoiDungId);
      
      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Error in getCart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy giỏ hàng',
        error: error.message
      });
    }
  }

  // POST /cart/add/:nguoi_dung_id - Thêm vào giỏ
  async addToCart(req, res) {
    try {
      const { nguoi_dung_id } = req.params;
      const { san_pham_id, so_luong } = req.body;

      // Validate input
      if (!nguoi_dung_id || !san_pham_id || !so_luong) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin người dùng, sản phẩm hoặc số lượng'
        });
      }

      if (so_luong < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng phải lớn hơn 0'
        });
      }

      const result = await cartService.addToCart(nguoi_dung_id, san_pham_id, so_luong);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Error in addToCart:', error);
      
      if (error.message.includes('không tồn tại') || 
          error.message.includes('hết hàng') ||
          error.message.includes('ngừng kinh doanh')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm sản phẩm vào giỏ hàng',
        error: error.message
      });
    }
  }

  // PUT /cart/update-product/:nguoi_dung_id - Cập nhật số lượng
  async updateCartByProduct(req, res) {
  try {
    const { nguoi_dung_id } = req.params;
    const { san_pham_id, so_luong } = req.body;

    // Validate input
    if (!nguoi_dung_id || !san_pham_id || !so_luong) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin người dùng, sản phẩm hoặc số lượng'
      });
    }

    const result = await cartService.updateCartItemByProductId(nguoi_dung_id, san_pham_id, so_luong);
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Error in updateCartByProduct:', error);
    
    if (error.message.includes('Không tìm thấy') || 
        error.message.includes('phải lớn hơn 0')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật giỏ hàng',
      error: error.message
    });
  }
}
  // DELETE /cart/remove/:nguoi_dung_id/:item_id - Xóa sản phẩm
  async removeProductFromCart(req, res) {
  try {
    const { nguoi_dung_id, san_pham_id } = req.params;

    if (!nguoi_dung_id || !san_pham_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin người dùng hoặc sản phẩm'
      });
    }

    const result = await cartService.removeCartItemByProductId(nguoi_dung_id, san_pham_id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error in removeProductFromCart:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
      error: error.message
    });
  }
}

  // DELETE /cart/clear/:nguoi_dung_id - Xóa toàn bộ giỏ
  async clearCart(req, res) {
    try {
      const { nguoi_dung_id } = req.params;
      
      if (!nguoi_dung_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin người dùng'
        });
      }

      const result = await cartService.clearCart(nguoi_dung_id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in clearCart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa giỏ hàng',
        error: error.message
      });
    }
  }
}

module.exports = new CartController();