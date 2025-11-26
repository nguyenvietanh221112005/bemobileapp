const AuthService = require('../service/authService');

class AuthController {
  // POST /auth/register
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /auth/login
  static async login(req, res) {
    try {
      const { email, mat_khau } = req.body;
      const result = await AuthService.login(email, mat_khau);
      
      return res.status(200).json(result);

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /auth/reset-password
  static async resetPassword(req, res) {
    try {
      const { user_id, mat_khau_cu, mat_khau_moi } = req.body;
      const result = await AuthService.resetPassword(user_id, mat_khau_cu, mat_khau_moi);
      
      return res.status(200).json(result);

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;