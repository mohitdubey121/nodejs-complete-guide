const Product = require('../models/product');
const Cart = require('../models/cart');
const path = require('../util/path');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path : '/' , 
        });
    }); 
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path : '/products' , 
        });
    }); 
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product : product,
            pageTitle : product.title,
            path : '/products'
        })
    });
}

exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            prods: products, 
            pageTitle: 'Orders', 
            path : '/orders' , 
        });
    }); 
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData){
                    cartProducts.push({productData : product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart',{
                path : '/cart',
                pageTitle : 'Your Cart',    
                products : cartProducts
            });
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.deleteProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.getCheckout =  (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/checkout',{
            prods : products,
            pageTitle : 'Your Cart',
            path : '/checkout'
        });
    });
}


