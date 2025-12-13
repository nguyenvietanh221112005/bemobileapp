// models/index.js
const db = require('../database/db');

// ==================== PRODUCT MODEL ====================
class ProductModel {
  static async create(productData) {
    const query = `
      INSERT INTO san_pham (ten, danh_muc_id, mo_ta, gia, anh_url, so_lan_ban, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      productData.ten,
      productData.danh_muc_id,
      productData.mo_ta,
      productData.gia,
      productData.anh_url,
      0,
      productData.trang_thai || 'còn hàng'
    ]);
    return result.insertId;
  }

  static async update(id, productData) {
    const query = `
      UPDATE san_pham 
      SET ten = ?, danh_muc_id = ?, mo_ta = ?, gia = ?, anh_url = ?, trang_thai = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      productData.ten,
      productData.danh_muc_id,
      productData.mo_ta,
      productData.gia,
      productData.anh_url,
      productData.trang_thai,
      id
    ]);
    return result.affectedRows;
  }

  static async delete(id) {
    const query = 'DELETE FROM san_pham WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE san_pham SET trang_thai = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM san_pham WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }
  static async getAll(limit, offset, danh_muc_id) {
  let query = `
    SELECT 
      sp.*,
      dm.ten_danh_muc,
      gg.loai AS giam_gia_loai,
      gg.gia_tri AS giam_gia_gia_tri
    FROM san_pham sp
    LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
    LEFT JOIN giam_gia gg 
      ON sp.id = gg.san_pham_id 
      AND gg.trang_thai = 1
      AND NOW() BETWEEN gg.ngay_bat_dau AND gg.ngay_ket_thuc
    WHERE 1=1
  `;

  const params = [];

  if (danh_muc_id) {
    query += ' AND sp.danh_muc_id = ?';
    params.push(danh_muc_id);
  }

  query += ' ORDER BY sp.ngay_tao DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await db.execute(query, params);
  return rows;
}


static async countAll(danh_muc_id) {
  let query = 'SELECT COUNT(*) as total FROM san_pham WHERE 1=1';
  const params = [];

  if (danh_muc_id) {
    query += ' AND danh_muc_id = ?';
    params.push(danh_muc_id);
  }

  const [rows] = await db.execute(query, params);
  return rows[0].total;
}

}

// ==================== SALE MODEL ====================
class SaleModel {

  static async getAllSales() {
  const query = `
    SELECT 
      gg.id,
      gg.san_pham_id,
      sp.ten AS ten_san_pham,
      gg.loai,
      gg.gia_tri,
      gg.ngay_bat_dau,
      gg.ngay_ket_thuc,
      gg.trang_thai
    FROM giam_gia gg
    JOIN san_pham sp ON sp.id = gg.san_pham_id
    ORDER BY gg.id DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
}

  static async getSaleProducts() {
  const query = `
    SELECT 
      sp.*,
      gg.loai,
      gg.gia_tri,
      CASE 
        WHEN gg.loai = 'percent' THEN sp.gia - (sp.gia * gg.gia_tri / 100)
        ELSE sp.gia - gg.gia_tri
      END AS gia_sau_giam
    FROM san_pham sp
    INNER JOIN giam_gia gg ON sp.id = gg.san_pham_id
    WHERE gg.trang_thai = 1
      AND NOW() BETWEEN gg.ngay_bat_dau AND gg.ngay_ket_thuc
      AND sp.trang_thai = 'còn hàng'
    ORDER BY gg.gia_tri DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
}

  static async create(saleData) {
    const query = `
      INSERT INTO giam_gia (san_pham_id, loai, gia_tri, ngay_bat_dau, ngay_ket_thuc, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      saleData.san_pham_id,
      saleData.loai,
      saleData.gia_tri,
      saleData.ngay_bat_dau,
      saleData.ngay_ket_thuc,
      saleData.trang_thai || 1
    ]);
    return result.insertId;
  }

  static async update(id, saleData) {
    const query = `
      UPDATE giam_gia 
      SET san_pham_id = ?, loai = ?, gia_tri = ?, ngay_bat_dau = ?, ngay_ket_thuc = ?, trang_thai = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      saleData.san_pham_id,
      saleData.loai,
      saleData.gia_tri,
      saleData.ngay_bat_dau,
      saleData.ngay_ket_thuc,
      saleData.trang_thai,
      id
    ]);
    return result.affectedRows;
  }

  static async delete(id) {
    const query = 'DELETE FROM giam_gia WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM giam_gia WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }
}

// ==================== ORDER MODEL ====================
class OrderModel {
  static async getAll() {
    const query = `
      SELECT 
        dh.*,
        nd.ho_ten,
        nd.email,
        dc.dia_chi_chi_tiet,
        dc.thanh_pho,
        dc.quan_huyen,
        dc.phuong_xa
      FROM don_hang dh
      LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
      LEFT JOIN dia_chi dc ON dh.dia_chi_id = dc.id
      ORDER BY dh.ngay_tao DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        dh.*,
        nd.ho_ten,
        nd.email,
        nd.sdt,
        dc.ten_nhan,
        dc.so_dien_thoai,
        dc.dia_chi_chi_tiet,
        dc.thanh_pho,
        dc.quan_huyen,
        dc.phuong_xa
      FROM don_hang dh
      LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
      LEFT JOIN dia_chi dc ON dh.dia_chi_id = dc.id
      WHERE dh.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async getOrderDetails(orderId) {
    const query = `
      SELECT * FROM don_hang_chi_tiet WHERE don_hang_id = ?
    `;
    const [rows] = await db.execute(query, [orderId]);
    return rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE don_hang SET trang_thai = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows;
  }

  // models/OrderModel.js
static async getOrderDetails(orderId) {
  const query = `
    SELECT 
      ctdh.id,
      ctdh.so_luong,
      ctdh.don_gia,
      sp.ten AS ten_san_pham
    FROM don_hang_chi_tiet ctdh
    JOIN san_pham sp ON ctdh.san_pham_id = sp.id
    WHERE ctdh.don_hang_id = ?
  `;
  const [rows] = await db.execute(query, [orderId]);
  return rows;
}

}

// ==================== STATISTICS MODEL ====================
class StatisticsModel {
  static async getOverview() {
    const queries = {
      totalRevenue: `
        SELECT COALESCE(SUM(tong_tien), 0) as total
        FROM don_hang 
        WHERE trang_thai = 'đã giao hàng'
      `,
      totalOrders: `
        SELECT COUNT(*) as total FROM don_hang
      `,
      totalProducts: `
        SELECT COUNT(*) as total FROM san_pham
      `,
      totalUsers: `
        SELECT COUNT(*) as total FROM nguoi_dung WHERE vai_tro = 'user'
      `,
      pendingOrders: `
        SELECT COUNT(*) as total FROM don_hang WHERE trang_thai = 'chờ xác nhận'
      `
    };

    const [revenueResult] = await db.execute(queries.totalRevenue);
    const [ordersResult] = await db.execute(queries.totalOrders);
    const [productsResult] = await db.execute(queries.totalProducts);
    const [usersResult] = await db.execute(queries.totalUsers);
    const [pendingResult] = await db.execute(queries.pendingOrders);

    return {
      totalRevenue: revenueResult[0].total,
      totalOrders: ordersResult[0].total,
      totalProducts: productsResult[0].total,
      totalUsers: usersResult[0].total,
      pendingOrders: pendingResult[0].total
    };
  }

  static async getTopProducts(limit = 10) {
    const query = `
      SELECT 
        sp.id,
        sp.ten,
        sp.gia,
        sp.anh_url,
        sp.so_lan_ban,
        COALESCE(SUM(dhct.so_luong), 0) as total_sold
      FROM san_pham sp
      LEFT JOIN don_hang_chi_tiet dhct ON sp.id = dhct.san_pham_id
      LEFT JOIN don_hang dh ON dhct.don_hang_id = dh.id
      WHERE dh.trang_thai = 'đã giao hàng' OR dh.trang_thai IS NULL
      GROUP BY sp.id
      ORDER BY total_sold DESC
      LIMIT ?
    `;
    const [rows] = await db.execute(query, [limit]);
    return rows;
  }

  static async getRevenue(startDate, endDate, groupBy = 'day') {
    let dateFormat;
    switch(groupBy) {
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const query = `
      SELECT 
        DATE_FORMAT(ngay_tao, ?) as period,
        COUNT(*) as total_orders,
        COALESCE(SUM(tong_tien), 0) as total_revenue
      FROM don_hang
      WHERE trang_thai = 'đã giao hàng'
        AND ngay_tao BETWEEN ? AND ?
      GROUP BY period
      ORDER BY period ASC
    `;
    
    const [rows] = await db.execute(query, [dateFormat, startDate, endDate]);
    return rows;
  }
}

module.exports = {
  ProductModel,
  SaleModel,
  OrderModel,
  StatisticsModel
};