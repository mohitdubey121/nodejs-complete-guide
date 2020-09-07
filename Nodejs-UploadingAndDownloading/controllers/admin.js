const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
        
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if(!image){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
              title: title,
              price: price,
              description: description
            },
            errorMessage: 'attached file is not an image',
            validationErrors: []
          });
    }

    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: {
          title: title,
          price: price,
          description: description
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
  
    const imageUrl = image.path;
    const product = new Product({
      // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user
    });
    product
      .save()
      .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/adminProduct');
      })
      .catch(err => {
        // return res.status(500).render('admin/edit-product', {
        //   pageTitle: 'Add Product',
        //   path: '/admin/add-product',
        //   editing: false,
        //   hasError: true,
        //   product: {
        //     title: title,
        //     imageUrl: imageUrl,
        //     price: price,
        //     description: description
        //   },
        //   errorMessage: 'Database operation failed, please try again.',
        //   validationErrors: []
        // });
        // res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

exports.getAdminProduct = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/adminProduct', {
                prods: products,
                pageTitle: 'Admin Product',
                path: '/admin/adminProduct'
            });
        })
        .catch(err =>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                path: '/admin/edit-product',
                pageTitle: 'Edit Product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []

            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(420).render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit Product',
            editing: true,
            hasError: true,
            errorMessage: null,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                console.log('idhar kyon ghusa');
                res.redirect('/');
            }
            else {
                product.title = updatedTitle;
                product.price = updatedPrice;
                product.description = updatedDescription;
                if (image) {
                    fileHelper.deleteFile(product.imageUrl);
                    product.imageUrl = image.path;
                }
                return product.save()
                    .then(result => {
                        console.log('Result Uploaded');
                        res.redirect('/admin/adminProduct');
                    })
            }
        })
        .catch(err =>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        if (!product){
            return next(new Error('Product Not Found'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: productId, userId: req.user._id })
        
    })
    .then(result => {
        console.log('PRODUCT DELETED SUCCESSFULLY');
        res.redirect('/admin/adminProduct');
    })
    .catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

