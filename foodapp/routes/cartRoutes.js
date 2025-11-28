const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.get('/:nguoi_dung_id', cartController.getCart);

router.post('/add/:nguoi_dung_id', cartController.addToCart);

router.put('/update-product/:nguoi_dung_id', cartController.updateCartByProduct);


router.delete('/remove/:nguoi_dung_id/:san_pham_id', cartController.removeProductFromCart);

router.delete('/clear/:nguoi_dung_id', cartController.clearCart);

module.exports = router;