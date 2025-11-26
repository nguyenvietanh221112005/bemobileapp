const CategoryModel = require('../models/CategoryModel');

class CategoryService {
    
    // Lấy tất cả danh mục
    static async getAllCategories() {
        try {
            const categories = await CategoryModel.getAllCategories();
            return {
                success: true,
                data: categories
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh mục: ${error.message}`);
        }
    }

    // Lấy sản phẩm theo danh mục
    static async getProductsByCategoryId(categoryId) {
        try {
            // Validate
            if (!categoryId || isNaN(categoryId)) {
                throw new Error('ID danh mục không hợp lệ');
            }

            const products = await CategoryModel.getProductsByCategoryId(categoryId);
            
            return {
                success: true,
                data: products,
                total: products.length
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm theo danh mục: ${error.message}`);
        }
    }

    // Lấy chi tiết sản phẩm
    static async getProductById(productId) {
        try {
            // Validate
            if (!productId || isNaN(productId)) {
                throw new Error('ID sản phẩm không hợp lệ');
            }

            const products = await CategoryModel.getProductsById(productId);
            
            if (products.length === 0) {
                throw new Error('Không tìm thấy sản phẩm');
            }

            return {
                success: true,
                data: products[0]
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy chi tiết sản phẩm: ${error.message}`);
        }
    }

    // Tìm kiếm sản phẩm
    static async searchProducts(keyword) {
        try {
            if (!keyword || keyword.trim() === '') {
                throw new Error('Từ khóa tìm kiếm không được để trống');
            }

            const products = await CategoryModel.searchProductById(keyword.trim());
            
            return {
                success: true,
                data: products,
                total: products.length,
                keyword: keyword
            };
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${error.message}`);
        }
    }

    // Lấy sản phẩm cho trang chủ
    static async getHomeProducts(options = {}) {
        try {
            const { sort = 'popular', sale = false } = options;
            
            let products = await CategoryModel.getHomeProducts();

            // Lọc chỉ sản phẩm có giảm giá nếu yêu cầu
            if (sale === 'true' || sale === true) {
                products = products.filter(p => p.gia_sau_giam < p.gia);
            }

            // Sắp xếp theo yêu cầu
            if (sort === 'price-asc') {
                products.sort((a, b) => (a.gia_sau_giam || a.gia) - (b.gia_sau_giam || b.gia));
            } else if (sort === 'price-desc') {
                products.sort((a, b) => (b.gia_sau_giam || b.gia) - (a.gia_sau_giam || a.gia));
            }
            // sort = 'popular' đã được xử lý trong query (ORDER BY so_lan_ban)

            // Format response
            const formattedProducts = products.map(p => ({
                id: p.id,
                ten: p.ten,
                danh_muc_id: p.danh_muc_id,
                mo_ta: p.mo_ta,
                gia_goc: parseFloat(p.gia),
                gia_hien_tai: parseFloat(p.gia_sau_giam || p.gia),
                co_giam_gia: p.gia_sau_giam < p.gia,
                loai_giam: p.loai || null,
                gia_tri_giam: p.gia_tri ? parseFloat(p.gia_tri) : null,
                phan_tram_tiet_kiem: p.gia_sau_giam < p.gia 
                    ? Math.round(((p.gia - p.gia_sau_giam) / p.gia) * 100) 
                    : 0,
                anh_url: p.anh_url,
                so_luong: p.so_luong,
                so_lan_ban: p.so_lan_ban,
                trang_thai: p.trang_thai
            }));

            return {
                success: true,
                data: formattedProducts,
                total: formattedProducts.length
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm trang chủ: ${error.message}`);
        }
    }

    // Lấy sản phẩm đang giảm giá
    static async getProductsOnSale() {
        try {
            const products = await CategoryModel.getAllProductSale();

            // Format response
            const formattedProducts = products.map(p => ({
                id: p.id,
                ten: p.ten,
                gia_goc: parseFloat(p.gia),
                gia_sau_giam: parseFloat(p.gia_sau_giam),
                loai_giam: p.loai,
                gia_tri_giam: parseFloat(p.gia_tri),
                phan_tram_tiet_kiem: Math.round(((p.gia - p.gia_sau_giam) / p.gia) * 100),
                anh_url: p.anh_url,
                ngay_bat_dau: p.ngay_bat_dau,
                ngay_ket_thuc: p.ngay_ket_thuc
            }));

            return {
                success: true,
                data: formattedProducts,
                total: formattedProducts.length
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm giảm giá: ${error.message}`);
        }
    }
}

module.exports = CategoryService;