const UserModel = require('../models/userModel');

class UserService {

    // Lấy thông tin người dùng theo id
    static async getUserInfoById(userId) {
        const user = await UserModel.getUserById(userId);

        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        return {
            success: true,
            message: 'Lấy thông tin thành công',
            data: {
                id: user.id,
                email: user.email,
                sdt: user.sdt,
                ho_ten: user.ho_ten,
                vai_tro: user.vai_tro,
                ngay_tao: user.ngay_tao
            }
        };
    }

    // Cập nhật thông tin người dùng theo id
    static async updateUserInfoById(userId, data) {
        await UserModel.updateUser(userId, data);

        const user = await UserModel.getUserById(userId);

        return {
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: {
                id: user.id,
                email: user.email,
                sdt: user.sdt,
                ho_ten: user.ho_ten,
                vai_tro: user.vai_tro,
                ngay_tao: user.ngay_tao
            }
        };
    }
}

module.exports = UserService;
