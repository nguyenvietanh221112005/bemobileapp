const AddressService = require("../service/addressService");

class AddressController {
  // GET /address/:nguoi_dung_id
  static async getAddressByUserId(req, res) {
    try {
      const nguoi_dung_id = req.params.nguoi_dung_id;
      const result = await AddressService.getAddressesByUserId(nguoi_dung_id);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateAddressById(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;

      const result = await AddressService.updateAddressById(id, data);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // AddressController.js
  static async createAddress(req, res) {
    try {
      const data = req.body;
      const result = await AddressService.addAddress(data);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async deleteAddress(req, res) {
    try {
      const { id, nguoi_dung_id } = req.params;
      const result = await AddressService.removeAddress(id, nguoi_dung_id);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.json({
        success: false,
        message: "Lỗi server khi xóa địa chỉ",
      });
    }
  }
}

module.exports = AddressController;
