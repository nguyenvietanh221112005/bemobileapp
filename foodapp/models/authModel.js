const db = require('../database/db');

class AuthModel {
  // Kiểm tra email đã tồn tại
  static async checkEmailExists(email) {
    const [rows] = await db.query(
      'SELECT id FROM nguoi_dung WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }

  
  // Tạo người dùng mới
  static async createUser(userData) {
    const { email, mat_khau, ho_ten, sdt } = userData;
    const [result] = await db.query(
      `INSERT INTO nguoi_dung (email, mat_khau, ho_ten, sdt,  vai_tro) 
       VALUES (?, ?, ?, ?, 'user')`,
      [email, mat_khau, ho_ten, sdt || null]
    );
    return result.insertId;
  }

  static async findUserByEmail(email) {
    const [rows] = await db.query(
      `SELECT id, email, mat_khau, ho_ten, sdt, vai_tro 
       FROM nguoi_dung 
       WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  // Tìm người dùng theo ID
  static async findUserById(id) {
    const [rows] = await db.query(
      `SELECT id, email, ho_ten, sdt, vai_tro, ngay_tao 
       FROM nguoi_dung 
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Đổi mật khẩu
  static async updatePassword(userId, newPassword) {
    const [result] = await db.query(
      'UPDATE nguoi_dung SET mat_khau = ? WHERE id = ?',
      [newPassword, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = AuthModel;