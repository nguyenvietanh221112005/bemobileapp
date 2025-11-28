const db = require('../database/db');

class CategoryModel {

    static async getAllCategories(){
        const [rows] = await db.query(
            `SELECT * FROM danh_muc ORDER BY ngay_tao DESC`
        );
        return rows;
    }

    static async getProductsByCategoryId(categoryId){
        const [rows] = await db.query(
            `SELECT sp.*, 
                gg.loai, gg.gia_tri,
                
                CASE 
                    WHEN gg.loai = 'percent' THEN sp.gia - (sp.gia * gg.gia_tri / 100)
                    WHEN gg.loai = 'fixed' THEN sp.gia - gg.gia_tri
                    ELSE sp.gia
                END AS gia_sau_giam
                
            FROM san_pham sp
            LEFT JOIN giam_gia gg ON sp.id = gg.san_pham_id 
                AND gg.trang_thai = 1
                AND gg.ngay_bat_dau <= NOW()
                AND gg.ngay_ket_thuc >= NOW()
            WHERE sp.danh_muc_id = ? 
              AND sp.trang_thai = còn hàng
            ORDER BY sp.so_lan_ban DESC`,
            [categoryId]
        );
        return rows;
    }

    static async getProductsById(productId){
        const [rows] = await db.query(
            `SELECT sp.*, 
                dm.ten_danh_muc,
                gg.loai, gg.gia_tri, gg.ngay_bat_dau, gg.ngay_ket_thuc,
                
                CASE 
                    WHEN gg.loai = 'percent' THEN sp.gia - (sp.gia * gg.gia_tri / 100)
                    WHEN gg.loai = 'fixed' THEN sp.gia - gg.gia_tri
                    ELSE sp.gia
                END AS gia_sau_giam
                
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN giam_gia gg ON sp.id = gg.san_pham_id 
                AND gg.trang_thai = 1
                AND gg.ngay_bat_dau <= NOW()
                AND gg.ngay_ket_thuc >= NOW()
            WHERE sp.id = ?`,
            [productId]
        );
        return rows;
    }

    static async searchProductById(nameProduct){
        // Tách từng từ để tìm kiếm linh hoạt hơn
        const keywords = nameProduct.trim().split(/\s+/);
        
        // Tạo điều kiện LIKE cho mỗi từ khóa
        const conditions = keywords.map(() => 
            '(sp.ten LIKE ? OR sp.mo_ta LIKE ?)'
        ).join(' AND ');
        
        // Tạo mảng params cho mỗi từ khóa
        const params = keywords.flatMap(keyword => [
            `%${keyword}%`, 
            `%${keyword}%`
        ]);

        const [rows] = await db.query(
            `SELECT sp.*, 
                dm.ten_danh_muc,
                gg.loai, gg.gia_tri,
                
                CASE 
                    WHEN gg.loai = 'percent' THEN sp.gia - (sp.gia * gg.gia_tri / 100)
                    WHEN gg.loai = 'fixed' THEN sp.gia - gg.gia_tri
                    ELSE sp.gia
                END AS gia_sau_giam,
                
                -- Tính điểm relevance để sắp xếp kết quả
                CASE
                    WHEN sp.ten LIKE ? THEN 100
                    WHEN sp.ten LIKE ? THEN 50
                    ELSE 10
                END AS relevance_score
                
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN giam_gia gg ON sp.id = gg.san_pham_id 
                AND gg.trang_thai = 1
                AND gg.ngay_bat_dau <= NOW()
                AND gg.ngay_ket_thuc >= NOW()
            WHERE ${conditions}
            AND trang_thai=còn hàng
            ORDER BY relevance_score DESC, sp.so_lan_ban DESC
            LIMIT 50`,
            [
                `${nameProduct}%`,        // Bắt đầu bằng từ khóa (điểm cao nhất)
                `%${nameProduct}%`,       // Chứa từ khóa
                ...params                 // Tất cả từ khóa riêng lẻ
            ]
        );
        return rows;
    }

    static async getHomeProducts(){
        const [rows] = await db.query(`
            SELECT sp.*, 
                gg.loai, gg.gia_tri,

                CASE 
                    WHEN gg.loai = 'percent' THEN sp.gia - (sp.gia * gg.gia_tri / 100)
                    WHEN gg.loai = 'fixed' THEN sp.gia - gg.gia_tri
                    ELSE sp.gia
                END AS gia_sau_giam

            FROM san_pham sp
            LEFT JOIN giam_gia gg ON sp.id = gg.san_pham_id 
                AND gg.trang_thai = 1
                AND gg.ngay_bat_dau <= NOW()
                AND gg.ngay_ket_thuc >= NOW()

            WHERE 
               sp.trang_thai = 'còn hàng'
            ORDER BY sp.so_lan_ban DESC
        `);

        return rows;
    }

    static async getAllProductSale(){
        const [rows] = await db.query(
            `SELECT sp.*, 
                gg.loai, gg.gia_tri, 
                gg.ngay_bat_dau, gg.ngay_ket_thuc,
                
                CASE 
                    WHEN gg.loai = 'percent' THEN sp.gia - (sp.gia * gg.gia_tri / 100)
                    WHEN gg.loai = 'fixed' THEN sp.gia - gg.gia_tri
                END AS gia_sau_giam
                
            FROM san_pham sp
            JOIN giam_gia gg ON sp.id = gg.san_pham_id
            WHERE gg.trang_thai = 1
              AND gg.ngay_bat_dau <= NOW()
              AND gg.ngay_ket_thuc >= NOW()
              
            ORDER BY gg.gia_tri DESC
            LIMIT 20`
        );
        return rows;
    }
}

module.exports = CategoryModel;