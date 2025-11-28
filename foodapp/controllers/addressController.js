const AddressService = require('../service/addressService');

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
                message: error.message
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
            const { id } = req.params; // chỉ cần id
            const result = await AddressService.removeAddress(id);
            res.json(result);
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }


    static async setDefaultAddress(req, res) {
        try {
            const { id } = req.params;
            const { nguoi_dung_id } = req.body; // FE gửi user id
            const result = await AddressService.setDefault(id, nguoi_dung_id);
            res.json(result);
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }


}

module.exports = AddressController;
