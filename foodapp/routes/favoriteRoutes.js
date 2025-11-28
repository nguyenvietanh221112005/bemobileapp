const express = require('express');
const router = express.Router();
const FavouriteController = require('../controllers/favoriteController');





// Lấy danh sách yêu thích
router.get('/', FavouriteController.getFavorites);

// Thêm sản phẩm vào yêu thích
router.post('/:product_id', FavouriteController.addFavorite);

// Xóa sản phẩm khỏi yêu thích
router.delete('/:product_id', FavouriteController.removeFavorite);


module.exports = router;
