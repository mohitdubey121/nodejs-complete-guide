const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/error')
// const mongoConnect = require ('./util/database').mongoConnect
const User = require('./models/user');

const MONGODB_URI =
    'mongodb+srv://mohit121:fFahW1PTuQOuStJ9@cluster0.egvwt.mongodb.net/shop?'
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session
    ({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)

app.use((req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user){
        return next();
    }
    User.findById('fFahW1PTuQOuStJ9')
        .then(user => {
            req.user = user;
            next();
        });
})

app.use('/admin', adminRoutes);

app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404page);

mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
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
