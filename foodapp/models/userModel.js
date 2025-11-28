const db = require('../database/db');

class UserModel {

    // 1. Lấy thông tin người dùng (GET /user/me)
    static async getUserById(userId) {
        const [rows] = await db.query(
            `SELECT id, email, sdt, ho_ten, vai_tro, ngay_tao 
             FROM nguoi_dung
             WHERE id = ?`,
            [userId]
        );
        return rows[0];
    }

    // 2. Cập nhật thông tin người dùng (PUT /user/update)
    static async updateUser(userId, data) {
        const { email, sdt, ho_ten } = data;

        await db.query(
            `UPDATE nguoi_dung 
             SET email = ?, sdt = ?, ho_ten = ?
             WHERE id = ?`,
            [email, sdt, ho_ten, userId]
        );

        return true;
    }
}

module.exports = UserModel;
