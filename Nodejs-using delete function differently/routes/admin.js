const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const { body } = require('express-validator');

//admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

//admin/add-product => POST
router.post('/add-product',
    body('title')
        .isString()
        .isLength({ min: 5 })
        .trim(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 5, max: 200 })
        .trim(),
    isAuth, adminController.postAddProduct);

//admin/adminProducts => GET
router.get('/adminProduct', isAuth, adminController.getAdminProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    body('title')
        .isString()
        .isLength({ min: 5 })
        .trim(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 5, max: 200 })
        .trim(),
    isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router;