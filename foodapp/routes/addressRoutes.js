const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/addressController");

// Lấy thông tin người dùng theo id
router.get("/:nguoi_dung_id", AddressController.getAddressByUserId);

// Cập nhật dia chi người dùng theo id
router.put("/:id", AddressController.updateAddressById);
// addressRoutes.js
router.post("/", AddressController.createAddress);
router.delete("/:id/:nguoi_dung_id", AddressController.deleteAddress);

module.exports = router;
