const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth.js');

//admin/add-product => GET
router.get('/login', authController.getLogin);

router.post('/login',
    body('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),

    body('password', 'please enter only numbers and text')
        .isAlphanumeric()
        .trim(),

    body('password', 'please enter password of atleast 5 characters')
        .isLength({ min: 5 })
        .trim(),
        
    authController.postLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    check('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail()
        .custom((value, { req }) => {
            // if (value === 'Mohitdubey@gmail.com') {
            //     throw new Error('sorry!this email is forbidden');
            // }
            // return true
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('email already exist');
                    }
                });
        }),

    body('password', 'please enter only numbers and text')
        .isAlphanumeric()
        .trim(),

    body('password', 'please enter password of atleast 5 characters')
        .isLength({ min: 5 })
        .trim(),

    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("both password didn't match!");
        }
        return true
    }),
    authController.postSignup
);


router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;