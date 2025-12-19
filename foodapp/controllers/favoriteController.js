const FavoriteService = require("../service/favoriteService");

class FavoriteController {
  static async getFavorites(req, res) {
    try {
      const { nguoi_dung_id } = req.query; // FE gửi user id
      const result = await FavoriteService.getFavorites(nguoi_dung_id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async addFavorite(req, res) {
    try {
      const { nguoi_dung_id } = req.body;
      const { product_id } = req.params;
      const result = await FavoriteService.addFavorite(nguoi_dung_id, product_id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const { nguoi_dung_id } = req.body;
      const { product_id } = req.params;
      const result = await FavoriteService.removeFavorite(nguoi_dung_id, product_id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = FavoriteController;
