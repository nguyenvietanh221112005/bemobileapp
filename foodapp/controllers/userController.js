const UserService = require('../service/userService');

class UserController {

    // GET /user/:id
    static async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const result = await UserService.getUserInfoById(userId);
            return res.json(result);
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /user/:id
    static async updateUserById(req, res) {
        try {
            const userId = req.params.id;
            const data = req.body;

            const result = await UserService.updateUserInfoById(userId, data);
            return res.json(result);
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = UserController;
