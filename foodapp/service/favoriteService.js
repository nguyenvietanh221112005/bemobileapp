const FavoriteModel = require('../models/favoriteModel');

class FavoriteService {

    static async getFavorites(nguoi_dung_id) {
        const favorites = await FavoriteModel.getFavoritesByUserId(nguoi_dung_id);
        return { success: true, data: favorites };
    }

    static async addFavorite(nguoi_dung_id, san_pham_id) {
        const fav = await FavoriteModel.addFavorite(nguoi_dung_id, san_pham_id);
        if (!fav) {
            throw new Error('Sản phẩm đã có trong yêu thích');
        }
        return { success: true, message: 'Thêm sản phẩm vào yêu thích thành công', data: fav };
    }

    static async removeFavorite(nguoi_dung_id, san_pham_id) {
        const deleted = await FavoriteModel.removeFavorite(nguoi_dung_id, san_pham_id);
        if (!deleted) {
            throw new Error('Xóa yêu thích thất bại hoặc sản phẩm không tồn tại');
        }
        return { success: true, message: 'Xóa sản phẩm khỏi yêu thích thành công' };
    }
}

module.exports = FavoriteService;
