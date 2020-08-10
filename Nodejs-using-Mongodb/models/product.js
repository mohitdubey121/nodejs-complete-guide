const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, imageUrl, price, description, _id, userId) {
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
        this._id = _id ? new mongodb.ObjectId(_id) : null
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id){
            dbOp = db.collection('products')
            .updateOne({_id: this._id}, { $set: this })
            //Update the product
        }else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log('Saved Successfully');
            })
            .catch(err => {
                console.log(err)
            });
    }

    static fetchAll(){
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            return products
        })
        .catch(err => console.log(err))
    }

    static findById(prodId){
        const db = getDb();
        return db.collection('products')
        .find({_id : new mongodb.ObjectId(prodId)})
        .next()
        .then(products => {
            console.log('products');
            return products;
        })
        .catch(err => console.log(err))
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id : new mongodb.ObjectId(prodId)})
        .then(result => {
            console.log('deleted');
            return result;
        })
        .catch(err => console.log(err))
    }
}


module.exports = Product;