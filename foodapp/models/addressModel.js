const db = require('../database/db');

class AddressModel {

    // 1. Lấy danh sách địa chỉ theo nguoi_dung_id
    static async getAddressesByUserId(nguoi_dung_id) {
        const [rows] = await db.query(
            `SELECT id, nguoi_dung_id, ten_nhan, so_dien_thoai, dia_chi_chi_tiet,
                    thanh_pho, quan_huyen, phuong_xa, ngay_tao
             FROM dia_chi
             WHERE nguoi_dung_id = ?`,
            [nguoi_dung_id]
        );
        return rows;
    }

    static async getAddressById(id) {
        const [rows] = await db.query(
            `SELECT id, nguoi_dung_id, ten_nhan, so_dien_thoai, dia_chi_chi_tiet,
                    thanh_pho, quan_huyen, phuong_xa, ngay_tao
             FROM dia_chi
             WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    static async updateAddressById(id, data) {
        // Lấy địa chỉ hiện tại
        const [current] = await db.execute(`SELECT * FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?`, [id, data.nguoi_dung_id]);
        if (!current.length) return false;

        const old = current[0];

        const query = `
        UPDATE dia_chi
        SET ten_nhan = ?, 
            so_dien_thoai = ?, 
            dia_chi_chi_tiet = ?, 
            thanh_pho = ?, 
            quan_huyen = ?, 
            phuong_xa = ?
        WHERE id = ? AND nguoi_dung_id = ?
    `;

        const [result] = await db.execute(query, [
            data.ten_nhan || old.ten_nhan,
            data.so_dien_thoai || old.so_dien_thoai,
            data.dia_chi_chi_tiet || old.dia_chi_chi_tiet,
            data.thanh_pho || old.thanh_pho,
            data.quan_huyen || old.quan_huyen,
            data.phuong_xa || old.phuong_xa,
            id,
            data.nguoi_dung_id
        ]);

        if (result.affectedRows === 0) return false;

        // Lấy lại địa chỉ vừa update
        const [rows] = await db.execute(`
        SELECT id, nguoi_dung_id, ten_nhan, so_dien_thoai, dia_chi_chi_tiet, thanh_pho, 
               quan_huyen, phuong_xa, ngay_tao
        FROM dia_chi
        WHERE id = ?
    `, [id]);

        return rows[0];
    }



    // AddressModel.js
    static async createAddress(data) {
        // 1. Kiểm tra số lượng địa chỉ của user
        const [existing] = await db.execute(
            `SELECT COUNT(*) AS count FROM dia_chi WHERE nguoi_dung_id = ?`,
            [data.nguoi_dung_id]
        );
        const count = existing[0].count;


        // 3. Thêm địa chỉ vào DB
        const query = `
        INSERT INTO dia_chi 
        (nguoi_dung_id, ten_nhan, so_dien_thoai, dia_chi_chi_tiet, thanh_pho, 
         quan_huyen, phuong_xa, ngay_tao)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
        const [result] = await db.execute(query, [
            data.nguoi_dung_id,
            data.ten_nhan,
            data.so_dien_thoai,
            data.dia_chi_chi_tiet,
            data.thanh_pho,
            data.quan_huyen || null,
            data.phuong_xa || null
        ]);

        // 4. Lấy lại địa chỉ vừa thêm với tất cả trường
        const [rows] = await db.execute(`
        SELECT id, nguoi_dung_id, ten_nhan, so_dien_thoai, dia_chi_chi_tiet, thanh_pho, 
               quan_huyen, phuong_xa, ngay_tao
        FROM dia_chi 
        WHERE id = ?
    `, [result.insertId]);

        return rows[0];
    }



    static async deleteAddressById(id, nguoi_dung_id) {
  const [result] = await db.execute(
    `DELETE FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?`,
    [id, nguoi_dung_id]
  );
  return result.affectedRows > 0;
}




    
}

module.exports = AddressModel;
