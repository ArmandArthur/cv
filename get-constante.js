var Sequelize = require('sequelize');
const sequelize = new Sequelize('cv', 'root', 'admin2019!!', {
  host: '127.0.0.1',
  dialect: 'mysql',
  operatorsAliases: false,	
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

module.exports = Object.freeze({
    sequelize: sequelize,
    Sequelize : Sequelize    
});

