const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://mohit121:fFahW1PTuQOuStJ9@cluster0.egvwt.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true }
  )
    .then(client => {
      console.log('connected');
      _db = client.db();
      callback(client);
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No Database Found!!!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
