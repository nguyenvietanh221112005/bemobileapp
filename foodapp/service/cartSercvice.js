const CartModel = require('../models/cartModel');

class CartService {
  // Lấy giỏ hàng
  async getCart(nguoiDungId) {
    const items = await CartModel.getCartDetails(nguoiDungId);
    
    // Tính tổng tiền
    const tongTien = items.reduce((total, item) => {
      return total + (item.gia_sau_giam * item.so_luong);
    }, 0);

    return {
      items,
      tongTien: parseFloat(tongTien.toFixed(2)),
      soLuongSanPham: items.length
    };
  }

  // Thêm sản phẩm vào giỏ
  async addToCart(nguoiDungId, sanPhamId, soLuong) {
    // Kiểm tra sản phẩm
    const product = await CartModel.checkProduct(sanPhamId);
    
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (product.trang_thai === 'hết hàng') {
      throw new Error('Sản phẩm đã hết hàng');
    }

    // Lấy hoặc tạo giỏ hàng
    const cart = await CartModel.getOrCreateCart(nguoiDungId);
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = await CartModel.getCartItem(cart.id, sanPhamId);

    if (existingItem) {
      // Cập nhật số lượng
      const newQuantity = existingItem.so_luong + soLuong;
      await CartModel.updateItemQuantity(cart.id, sanPhamId, newQuantity);
      
      return {
        message: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng',
        soLuongMoi: newQuantity
      };
    } else {
      // Thêm mới
      await CartModel.addItem(cart.id, sanPhamId, soLuong);
      
      return {
        message: 'Đã thêm sản phẩm vào giỏ hàng',
        soLuong
      };
    }
  }

  async updateCartItemByProductId(nguoiDungId, sanPhamId, soLuong) {
  if (soLuong < 1) {
    throw new Error('Số lượng phải lớn hơn 0');
  }

  const result = await CartModel.updateItemByProductId(sanPhamId, nguoiDungId, soLuong);

  if (result.affectedRows === 0) {
    throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
  }

  return {
    message: 'Đã cập nhật số lượng sản phẩm',
    soLuongMoi: soLuong
  };
}

  // Xóa sản phẩm
  async removeCartItemByProductId(nguoiDungId, sanPhamId) {
  const result = await CartModel.removeItemByProductId(sanPhamId, nguoiDungId);

  if (result.affectedRows === 0) {
    throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
  }

  return {
    message: 'Đã xóa sản phẩm khỏi giỏ hàng'
  };
}


  // Xóa toàn bộ giỏ hàng
  async clearCart(nguoiDungId) {
    await CartModel.clearCart(nguoiDungId);

    return {
      message: 'Đã xóa toàn bộ giỏ hàng'
    };
  }
}

module.exports = new CartService();