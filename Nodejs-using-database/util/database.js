const {Sequelize} = require ('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'm!907312', {
  dialect : 'mysql',
  host : 'localhost' 
})

module.exports = sequelize;