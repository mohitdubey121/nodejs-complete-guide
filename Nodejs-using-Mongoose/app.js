const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error')
// const mongoConnect = require ('./util/database').mongoConnect
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("5f3259b3c5771d2a083043e9")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404page);

mongoose.connect('mongodb+srv://mohit121:fFahW1PTuQOuStJ9@cluster0.egvwt.mongodb.net/shop?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        User.findOne().then(user => {
            if(!user){
                const user = new User({
                    name: 'Mohit',
                    email: 'mohitdubey036@gmail.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
