const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const MulterConfig = require('../middleware/multer-config');
const ProductsController = require('../controllers/products');

router.get('/', ProductsController.products_get_all);

router.get('/:productId', ProductsController.products_get_one)

router.post('/', checkAuth, MulterConfig.upload.single('productImage'), ProductsController.products_create_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;