const db = require('../database/db');

class FavoriteModel {

    // Lấy danh sách sản phẩm yêu thích theo người dùng
    static async getFavoritesByUserId(nguoi_dung_id) {
        const [rows] = await db.execute(
            `SELECT san_pham_id 
             FROM yeu_thich 
             WHERE nguoi_dung_id = ?`,
            [nguoi_dung_id]
        );
        return rows; // [{ san_pham_id: 5 }, { san_pham_id: 9 }]
    }

    // Thêm sản phẩm vào yêu thích
    static async addFavorite(nguoi_dung_id, san_pham_id) {
        // Kiểm tra xem đã tồn tại chưa
        const [existing] = await db.execute(
            `SELECT * 
             FROM yeu_thich 
             WHERE nguoi_dung_id = ? AND san_pham_id = ?`,
            [nguoi_dung_id, san_pham_id]
        );

        if (existing.length > 0) return null; // đã có rồi

        // Thêm mới
        await db.execute(
            `INSERT INTO yeu_thich (nguoi_dung_id, san_pham_id) 
             VALUES (?, ?)`,
            [nguoi_dung_id, san_pham_id]
        );

        return { nguoi_dung_id, san_pham_id };
    }

    // Xóa sản phẩm yêu thích
    static async removeFavorite(nguoi_dung_id, san_pham_id) {
        const [result] = await db.execute(
            `DELETE FROM yeu_thich 
             WHERE nguoi_dung_id = ? AND san_pham_id = ?`,
            [nguoi_dung_id, san_pham_id]
        );

        return result.affectedRows > 0;
    }
}

module.exports = FavoriteModel;
