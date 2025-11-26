const AuthModel = require('../models/authModel');

class AuthService {
  // Đăng ký người dùng
  static async register(userData) {
    const { email, mat_khau, ho_ten, sdt} = userData;

    // Kiểm tra email đã tồn tại
    const emailExists = await AuthModel.checkEmailExists(email);
    if (emailExists) {
      throw new Error('Email đã được sử dụng');
    }

    
    

    // Tạo người dùng mới
    const userId = await AuthModel.createUser({
      email,
      mat_khau,
      ho_ten,
      sdt
    });

    // Lấy thông tin người dùng vừa tạo
    const user = await AuthModel.findUserById(userId);

    return {
      success: true,
      message: 'Đăng ký thành công',
      data: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        sdt: user.sdt,
        vai_tro: user.vai_tro
      }
    };
  }

  // Đăng nhập
  static async login(email, mat_khau) {
    // Tìm người dùng
    const user = await AuthModel.findUserByEmail(email);
    
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu
    if (user.mat_khau !== mat_khau) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        sdt: user.sdt,
        vai_tro: user.vai_tro
      }
    };
  }

  // Đổi mật khẩu
  static async resetPassword(userId, mat_khau_cu, mat_khau_moi) {
    // Tìm người dùng
    const user = await AuthModel.findUserById(userId);
    
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Lấy mật khẩu hiện tại
    const userWithPassword = await AuthModel.findUserByEmail(user.email);

    // Kiểm tra mật khẩu cũ
    if (userWithPassword.mat_khau !== mat_khau_cu) {
      throw new Error('Mật khẩu cũ không đúng');
    }

    // Cập nhật mật khẩu mới
    const updated = await AuthModel.updatePassword(userId, mat_khau_moi);

    if (!updated) {
      throw new Error('Đổi mật khẩu thất bại');
    }

    return {
      success: true,
      message: 'Đổi mật khẩu thành công'
    };
  }
}

module.exports = AuthService;