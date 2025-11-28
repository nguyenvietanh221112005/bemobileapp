const db = require('../database/db');

class CartModel {
  // Lấy hoặc tạo giỏ hàng cho user
  static async getOrCreateCart(nguoiDungId) {
    const [carts] = await db.query(
      'SELECT id FROM gio_hang WHERE nguoi_dung_id = ?',
      [nguoiDungId]
    );

    if (carts.length > 0) {
      return carts[0];
    }

    const [result] = await db.query(
      'INSERT INTO gio_hang (nguoi_dung_id) VALUES (?)',
      [nguoiDungId]
    );

    return { id: result.insertId };
  }

  // Lấy chi tiết giỏ hàng
  static async getCartDetails(nguoiDungId) {
    const query = `
      SELECT 
        ghct.id,
        ghct.san_pham_id,
        ghct.so_luong,
        sp.ten,
        sp.gia,
        sp.anh_url,
        sp.trang_thai,
        gh.nguoi_dung_id,
        COALESCE(
          CASE 
            WHEN gg.loai = 'percent' THEN sp.gia * (1 - gg.gia_tri / 100)
            WHEN gg.loai = 'fixed' THEN sp.gia - gg.gia_tri
            ELSE sp.gia
          END, 
          sp.gia
        ) AS gia_sau_giam,
        gg.loai AS loai_giam_gia,
        gg.gia_tri AS gia_tri_giam_gia
      FROM gio_hang gh
      JOIN gio_hang_chi_tiet ghct ON gh.id = ghct.gio_hang_id
      JOIN san_pham sp ON ghct.san_pham_id = sp.id
      LEFT JOIN giam_gia gg ON sp.id = gg.san_pham_id 
        AND gg.trang_thai = 1
        AND NOW() BETWEEN gg.ngay_bat_dau AND gg.ngay_ket_thuc
      WHERE gh.nguoi_dung_id = ?
    `;

    const [items] = await db.query(query, [nguoiDungId]);
    return items;
  }

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  static async getCartItem(gioHangId, sanPhamId) {
    const [items] = await db.query(
      'SELECT * FROM gio_hang_chi_tiet WHERE gio_hang_id = ? AND san_pham_id = ?',
      [gioHangId, sanPhamId]
    );
    return items[0];
  }

  // Thêm sản phẩm vào giỏ
  static async addItem(gioHangId, sanPhamId, soLuong) {
    const [result] = await db.query(
      'INSERT INTO gio_hang_chi_tiet (gio_hang_id, san_pham_id, so_luong) VALUES (?, ?, ?)',
      [gioHangId, sanPhamId, soLuong]
    );
    return result;
  }

  // Cập nhật số lượng sản phẩm
  static async updateItemQuantity(gioHangId, sanPhamId, soLuong) {
    const [result] = await db.query(
      'UPDATE gio_hang_chi_tiet SET so_luong = ? WHERE gio_hang_id = ? AND san_pham_id = ?',
      [soLuong, gioHangId, sanPhamId]
    );
    return result;
  }

  // Cập nhật số lượng theo item_id
  static async updateItemByProductId(sanPhamId, nguoiDungId, soLuong) {
  const [result] = await db.query(
    `UPDATE gio_hang_chi_tiet ghct
     JOIN gio_hang gh ON ghct.gio_hang_id = gh.id
     SET ghct.so_luong = ?
     WHERE ghct.san_pham_id = ? AND gh.nguoi_dung_id = ?`,
    [soLuong, sanPhamId, nguoiDungId]
  );
  return result;
}

  // Xóa sản phẩm khỏi giỏ
  static async removeItemByProductId(sanPhamId, nguoiDungId) {
  const [result] = await db.query(
    `DELETE ghct FROM gio_hang_chi_tiet ghct
     JOIN gio_hang gh ON ghct.gio_hang_id = gh.id
     WHERE ghct.san_pham_id = ? AND gh.nguoi_dung_id = ?`,
    [sanPhamId, nguoiDungId]
  );
  return result;
}

  // Xóa toàn bộ giỏ hàng
  static async clearCart(nguoiDungId) {
    const [result] = await db.query(
      `DELETE ghct FROM gio_hang_chi_tiet ghct
       JOIN gio_hang gh ON ghct.gio_hang_id = gh.id
       WHERE gh.nguoi_dung_id = ?`,
      [nguoiDungId]
    );
    return result;
  }

  // Kiểm tra sản phẩm có tồn tại và còn hàng không
  static async checkProduct(sanPhamId) {
    const [products] = await db.query(
      'SELECT id, ten, trang_thai FROM san_pham WHERE id = ?',
      [sanPhamId]
    );
    return products[0];
  }
}

module.exports = CartModel;