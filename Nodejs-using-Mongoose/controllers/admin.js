const Product = require('../models/product');
const { populate } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    })
    product.save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/adminProduct');
        })
        .catch(err => console.log(err))
}

exports.getAdminProduct = (req, res, next) => {
    Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
        .then(products => {
            res.render('admin/adminProduct', {
                prods: products,
                pageTitle: 'Admin Product',
                path: '/admin/adminProduct',
            });
        })
        .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title
    const updatedImageUrl = req.body.imageUrl
    const updatedPrice = req.body.price
    const updatedDescription = req.body.description
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        product.description = updatedDescription
        return product.save()
    })
        .then(result => {
            console.log('Result Uploaded');
            res.redirect('/admin/adminProduct');
        })
        .catch(err => console.log(err))
}



exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(result => {
            console.log('PRODUCT DELETED SUCCESSFULLY');
            res.redirect('/admin/adminProduct');
        })
        .catch(err => console.log(err));
}

