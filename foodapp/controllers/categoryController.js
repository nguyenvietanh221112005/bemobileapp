const CategoryService = require('../service/categoryService');

class CategoryController {
    
    // GET /category - Lấy tất cả danh mục
    static async getAllCategories(req, res) {
        try {
            const result = await CategoryService.getAllCategories();
            
            return res.status(200).json({
                success: true,
                message: 'Lấy danh sách danh mục thành công',
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /category/:id/products - Lấy sản phẩm theo danh mục
    static async getProductsByCategory(req, res) {
        try {
            const { id } = req.params;
            const result = await CategoryService.getProductsByCategoryId(id);
            
            return res.status(200).json({
                success: true,
                message: 'Lấy sản phẩm theo danh mục thành công',
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(error.message.includes('không hợp lệ') ? 400 : 500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /products/:id - Lấy chi tiết sản phẩm
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const result = await CategoryService.getProductById(id);
            
            return res.status(200).json({
                success: true,
                message: 'Lấy chi tiết sản phẩm thành công',
                data: result.data
            });
        } catch (error) {
            const statusCode = error.message.includes('không tìm thấy') ? 404 :
                              error.message.includes('không hợp lệ') ? 400 : 500;
            
            return res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /products/search?q=... - Tìm kiếm sản phẩm
    static async searchProducts(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp từ khóa tìm kiếm (q)'
                });
            }

            const result = await CategoryService.searchProducts(q);
            
            return res.status(200).json({
                success: true,
                message: 'Tìm kiếm sản phẩm thành công',
                data: result.data,
                total: result.total,
                keyword: result.keyword
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /products?sort=popular&sale=true - Lấy sản phẩm trang chủ
    static async getHomeProducts(req, res) {
        try {
            const { sort, sale } = req.query;
            
            const result = await CategoryService.getHomeProducts({ sort, sale });
            
            return res.status(200).json({
                success: true,
                message: 'Lấy sản phẩm trang chủ thành công',
                data: result.data,
                total: result.total,
                filters: {
                    sort: sort || 'popular',
                    sale: sale === 'true'
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /products/sale - Lấy sản phẩm đang giảm giá
    static async getProductsOnSale(req, res) {
        try {
            const result = await CategoryService.getProductsOnSale();
            
            return res.status(200).json({
                success: true,
                message: 'Lấy sản phẩm giảm giá thành công',
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = CategoryController;