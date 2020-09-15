const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const User = require('../models/user');


// exports.getPosts = (req, res, next) => {
//     const currentPage = req.query.page || 1;
//     const perPage = 2;
//     let totalItems;
//     Post.find()
//         .countDocuments()
//         .then(count => {
//             totalItems = count;
//             return Post.find()
//                 .skip((currentPage - 1) * perPage)
//                 .limit(perPage);
//         })
//         .then(posts => {
//             res
//                 .status(200)
//                 .json({
//                     message: 'Fetched posts successfully',
//                     posts: posts,
//                     totalItems: totalItems
//                 })
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched posts successfully',
            posts: posts,
            totalItems: totalItems
        })
    }
    catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.createPosts = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed, entered data is incorrect.');
//         error.statusCode = 422;
//         throw error;
//     }
//     if (!req.file) {
//         const error = new Error('No Image Provided');
//         error.statusCode = 422;
//         throw error;
//     }
//     const imageUrl = `images/${req.file.filename}`;
//     const title = req.body.title;
//     const content = req.body.content;
//     let creator;
//     const post = new Post({
//         title: title,
//         content: content,
//         imageUrl: imageUrl,
//         creator: req.user
//     });
//     post.save()
//         .then(result => {
//             return User.findById(req.user);
//         })
//         .then(user => {
//             creator = user;
//             user.posts.push(post);
//             return user.save();
//         })
//         .then(result => {
//             res.status(201).json({
//                 message: 'Post Created Successfully',
//                 post: post,
//                 creator: { _id: creator._id, name: creator.name }
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }
exports.createPosts = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No Image Provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = `images/${req.file.filename}`;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.user
    });
    try {
        await post.save()
        const user = await User.findById(req.user);
        const creator = user.posts.push(post);
        await user.save();
        io.getIO().emit('posts', {
            action: 'create',
            post: { ...post._doc, creator: { _id: req.user, name: user.name } }
        })
        res.status(201).json({
            message: 'Post Created Successfully',
            post: post,
            creator: { _id: creator._id, name: creator.name }
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.getPost = (req, res, next) => {
//     const postId = req.params.postId;
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find the post');
//                 error.statusCode = 404;
//                 throw error;
//             }
//             res.status(200).json({
//                 message: 'Post fetched successfully',
//                 post: post
//             })
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    if (!post) {
        const error = new Error('Could not find the post');
        error.statusCode = 404;
        throw error;
    }
    try {
        res.status(200).json({
            message: 'Post fetched successfully',
            post: post
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.updatePost = (req, res, next) => {
//     const postId = req.params.postId;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed, entered data is incorrect.');
//         error.statusCode = 422;
//         throw error;
//     }
//     const title = req.body.title;
//     const content = req.body.content;
//     let imageUrl = req.body.image;
//     if (req.file) {
//         imageUrl = `images/${req.file.filename}`;
//     }

//     if (!imageUrl) {
//         const error = new Error('No image picked');
//         error.statusCode = 422;
//         throw error;
//     }

//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find the post');
//                 error.statusCode = 404;
//                 throw error;
//             }
//             if (post.creator.toString() !== req.user) {
//                 const error = new Error('Not Authorized!');
//                 error.statusCode = 403;
//                 throw error;
//             }
//             if (imageUrl !== post.imageUrl) {
//                 clearImage(post.imageUrl);
//             }
//             post.title = title;
//             post.imageUrl = imageUrl;
//             post.content = content;
//             return post.save();
//         })
//         .then(result => {
//             res.status(200).json({ message: 'Post updated successfuly!', post: result })
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = `images/${req.file.filename}`;
    }

    if (!imageUrl) {
        const error = new Error('No image picked');
        error.statusCode = 422;
        throw error;
    }

    const post = await Post.findById(postId)

    if (!post) {
        const error = new Error('Could not find the post');
        error.statusCode = 404;
        throw error;
    }
    if (post.creator.toString() !== req.user) {
        const error = new Error('Not Authorized!');
        error.statusCode = 403;
        throw error;
    }
    if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
    }
    try {
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        post.save();
        res.status(200).json({ message: 'Post updated successfuly!', post: post })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    })
}

// exports.deletePost = (req, res, next) => {
//     const postId = req.params.postId;
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find the post');
//                 error.statusCode = 404;
//                 throw error;
//             }
//             if (post.creator.toString() !== req.user) {
//                 const error = new Error('Not Authorized!');
//                 error.statusCode = 403;
//                 throw error;
//             }
//             clearImage(post.imageUrl);
//             return Post.findByIdAndRemove(postId);
//         })
//         .then(result => {
//             return User.findById(req.user);
//         })
//         .then(user => {
//             user.posts.pull(postId);
//             return user.save();
//         })
//         .then(result => {
//             res.status(200).json({ message: 'Post Deleted Successfuly!' })
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    try {
        if (post.creator.toString() !== req.user) {
            const error = new Error('Not Authorized!');
            error.statusCode = 403;
            throw error;
        }
        if (!post) {
            const error = new Error('Could not find the post');
            error.statusCode = 404;
            throw error;
        }
        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(postId);
        const user = await User.findById(req.user);
        await user.posts.pull(postId);
        user.save();
        res.status(200).json({ message: 'Post Deleted Successfuly!' })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}