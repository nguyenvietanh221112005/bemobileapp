const db = require('../database/db');

class Order {
  // Tạo đơn hàng mới
  static async create(nguoiDungId, diaChiId, ghiChu = null) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Lấy giỏ hàng của user
      const [gioHang] = await connection.query(
        'SELECT id FROM gio_hang WHERE nguoi_dung_id = ?',
        [nguoiDungId]
      );

      if (!gioHang.length) {
        throw new Error('Giỏ hàng trống');
      }

      const gioHangId = gioHang[0].id;

      // Lấy chi tiết giỏ hàng
      const [items] = await connection.query(
        `SELECT ghct.san_pham_id, ghct.so_luong, sp.ten, sp.gia, sp.trang_thai,
                g.loai as giam_gia_loai, g.gia_tri as giam_gia_gia_tri,
                g.ngay_bat_dau, g.ngay_ket_thuc, g.trang_thai as giam_gia_trang_thai
         FROM gio_hang_chi_tiet ghct
         JOIN san_pham sp ON ghct.san_pham_id = sp.id
         LEFT JOIN giam_gia g ON sp.id = g.san_pham_id 
           AND g.trang_thai = 1 
           AND NOW() BETWEEN g.ngay_bat_dau AND g.ngay_ket_thuc
         WHERE ghct.gio_hang_id = ?`,
        [gioHangId]
      );

      if (!items.length) {
        throw new Error('Giỏ hàng trống');
      }

      // Kiểm tra tồn kho
      for (const item of items) {
        if (item.trang_thai === 'hết hàng') {
          throw new Error(`Sản phẩm "${item.ten}" đã hết hàng`);
        }
      }

      // Tính tổng tiền
      let tongTien = 0;
      items.forEach(item => {
        let donGia = parseFloat(item.gia);
        
        // Áp dụng giảm giá nếu có
        if (item.giam_gia_trang_thai === 1) {
          if (item.giam_gia_loai === 'percent') {
            donGia = donGia * (1 - item.giam_gia_gia_tri / 100);
          } else if (item.giam_gia_loai === 'fixed') {
            donGia = Math.max(0, donGia - item.giam_gia_gia_tri);
          }
        }
        
        tongTien += donGia * item.so_luong;
      });

      // Tạo đơn hàng
      const [result] = await connection.query(
        `INSERT INTO don_hang (nguoi_dung_id, dia_chi_id, tong_tien, ghi_chu)
         VALUES (?, ?, ?, ?)`,
        [nguoiDungId, diaChiId, tongTien, ghiChu]
      );

      const donHangId = result.insertId;

      // Thêm chi tiết đơn hàng
      for (const item of items) {
        let donGia = parseFloat(item.gia);
        
        if (item.giam_gia_trang_thai === 1) {
          if (item.giam_gia_loai === 'percent') {
            donGia = donGia * (1 - item.giam_gia_gia_tri / 100);
          } else if (item.giam_gia_loai === 'fixed') {
            donGia = Math.max(0, donGia - item.giam_gia_gia_tri);
          }
        }

        await connection.query(
          `INSERT INTO don_hang_chi_tiet (don_hang_id, san_pham_id, ten_san_pham, don_gia, so_luong)
           VALUES (?, ?, ?, ?, ?)`,
          [donHangId, item.san_pham_id, item.ten, donGia, item.so_luong]
        );

        // Cập nhật số lần bán
        await connection.query(
          'UPDATE san_pham SET so_lan_ban = so_lan_ban + ? WHERE id = ?',
          [item.so_luong, item.san_pham_id]
        );
      }

      // Xóa giỏ hàng
      await connection.query(
        'DELETE FROM gio_hang_chi_tiet WHERE gio_hang_id = ?',
        [gioHangId]
      );

      await connection.commit();
      return donHangId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy lịch sử đơn hàng theo trạng thái
  static async getHistory(nguoiDungId, trangThai = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT dh.id, dh.tong_tien, dh.trang_thai, dh.ghi_chu, dh.ngay_tao,
             dc.ten_nhan, dc.so_dien_thoai, dc.dia_chi_chi_tiet, dc.phuong_xa, dc.quan_huyen, dc.thanh_pho
      FROM don_hang dh
      LEFT JOIN dia_chi dc ON dh.dia_chi_id = dc.id
      WHERE dh.nguoi_dung_id = ?
    `;
    
    const params = [nguoiDungId];
    
    if (trangThai) {
      query += ' AND dh.trang_thai = ?';
      params.push(trangThai);
    }
    
    query += ' ORDER BY dh.ngay_tao DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [orders] = await db.query(query, params);

    // Đếm tổng số đơn hàng
    let countQuery = 'SELECT COUNT(*) as total FROM don_hang WHERE nguoi_dung_id = ?';
    const countParams = [nguoiDungId];
    
    if (trangThai) {
      countQuery += ' AND trang_thai = ?';
      countParams.push(trangThai);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Chi tiết đơn hàng
  static async getById(donHangId, nguoiDungId) {
    const [orders] = await db.query(
      `SELECT dh.*, 
              dc.ten_nhan, dc.so_dien_thoai, dc.dia_chi_chi_tiet, 
              dc.phuong_xa, dc.quan_huyen, dc.thanh_pho
       FROM don_hang dh
       LEFT JOIN dia_chi dc ON dh.dia_chi_id = dc.id
       WHERE dh.id = ? AND dh.nguoi_dung_id = ?`,
      [donHangId, nguoiDungId]
    );

    if (!orders.length) {
      return null;
    }

    const order = orders[0];

    // Lấy chi tiết sản phẩm
    const [items] = await db.query(
      `SELECT dhct.*, sp.anh_url
       FROM don_hang_chi_tiet dhct
       LEFT JOIN san_pham sp ON dhct.san_pham_id = sp.id
       WHERE dhct.don_hang_id = ?`,
      [donHangId]
    );

    order.chi_tiet = items;
    return order;
  }

  // Hủy đơn hàng
  static async cancel(donHangId, nguoiDungId) {
    const [orders] = await db.query(
      'SELECT trang_thai FROM don_hang WHERE id = ? AND nguoi_dung_id = ?',
      [donHangId, nguoiDungId]
    );

    if (!orders.length) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    const trangThai = orders[0].trang_thai;
    const allowedStatuses = ['chờ xác nhận', 'hoàn tất đặt hàng'];

    if (!allowedStatuses.includes(trangThai)) {
      throw new Error('Không thể hủy đơn hàng ở trạng thái này');
    }

    // Có thể thêm trạng thái "đã hủy" vào ENUM nếu muốn
    // Hiện tại chỉ xóa đơn hàng
    await db.query('DELETE FROM don_hang WHERE id = ?', [donHangId]);

    return true;
  }

  // Cập nhật trạng thái đơn hàng (cho admin hoặc hệ thống)
  static async updateStatus(donHangId, trangThaiMoi, nguoiDungId = null) {
    const validStatuses = [
      'chờ xác nhận',
      'hoàn tất đặt hàng',
      'chuẩn bị',
      'đang giao hàng',
      'đã giao hàng'
    ];

    if (!validStatuses.includes(trangThaiMoi)) {
      throw new Error('Trạng thái không hợp lệ');
    }

    let query = 'UPDATE don_hang SET trang_thai = ? WHERE id = ?';
    const params = [trangThaiMoi, donHangId];

    if (nguoiDungId) {
      query += ' AND nguoi_dung_id = ?';
      params.push(nguoiDungId);
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      throw new Error('Không tìm thấy đơn hàng hoặc không có quyền cập nhật');
    }

    return true;
  }

  // Đếm đơn hàng theo trạng thái
  static async countByStatus(nguoiDungId) {
    const [result] = await db.query(
      `SELECT trang_thai, COUNT(*) as so_luong
       FROM don_hang
       WHERE nguoi_dung_id = ?
       GROUP BY trang_thai`,
      [nguoiDungId]
    );

    return result;
  }
}

module.exports = Order;