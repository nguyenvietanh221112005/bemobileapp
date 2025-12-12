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

    static async removeAddress(id, nguoi_dung_id) {
  const deleted = await AddressModel.deleteAddressById(id, nguoi_dung_id);

  if (!deleted) {
    throw new Error('Xóa địa chỉ thất bại hoặc không tìm thấy id hoặc không thuộc người dùng');
  }

  return { success: true, message: 'Xóa địa chỉ thành công' };
}



   


}

module.exports = AddressService;
