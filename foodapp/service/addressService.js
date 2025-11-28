const AddressModel = require('../models/addressModel');

class AddressService {

    // Lấy danh sách địa chỉ theo nguoi_dung_id
    static async getAddressesByUserId(nguoi_dung_id) {
        const addresses = await AddressModel.getAddressesByUserId(nguoi_dung_id);

        if (!addresses || addresses.length === 0) {
            throw new Error('Người dùng chưa có địa chỉ');
        }

        return {
            success: true,
            message: 'Lấy danh sách địa chỉ thành công',
            data: addresses
        };
    }

    static async updateAddressById(id, data) {
        const updated = await AddressModel.updateAddressById(id, data);
        if (!updated) {
            throw new Error('Cập nhật địa chỉ thất bại hoặc không tìm thấy id');
        }
        const address = await AddressModel.getAddressById(id); // lấy lại địa chỉ vừa update
        return { success: true, message: 'Cập nhật địa chỉ thành công', data: [address] };
    }

    static async addAddress(data) {
        if (!data.nguoi_dung_id) throw new Error('Thiếu nguoi_dung_id');

        const address = await AddressModel.createAddress(data);
        return { success: true, message: 'Thêm địa chỉ thành công', data: [address] };
    }

    static async removeAddress(id) {
        const deleted = await AddressModel.deleteAddressById(id);
        if (!deleted) {
            throw new Error('Xóa địa chỉ thất bại hoặc không tìm thấy id');
        }
        return { success: true, message: 'Xóa địa chỉ thành công' };
    }


    static async setDefault(id, nguoi_dung_id) {
        const success = await AddressModel.setDefaultAddress(id, nguoi_dung_id);
        if (!success) {
            throw new Error('Đặt địa chỉ mặc định thất bại hoặc không tìm thấy id');
        }
        return { success: true, message: 'Đặt địa chỉ mặc định thành công' };
    }


}

module.exports = AddressService;
