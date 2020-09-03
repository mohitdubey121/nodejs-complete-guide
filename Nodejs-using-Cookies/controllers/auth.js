const User = require('../models/user');

exports.getLogin = (req, res, next) => {   
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    User.findById("5f3259b3c5771d2a083043e9")
        .then(user => {
            req.session.user = user,
            req.session.isLoggedIn = true
            res.redirect('/');
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
}