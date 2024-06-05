const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bpovey3ohainbzofxkqy', 'uplj4sfn0un9pbsc', 'wwut3692ai9qsyAagChB', {
    host: 'bpovey3ohainbzofxkqy-mysql.services.clever-cloud.com',
    dialect: 'mysql'
});

module.exports = sequelize;
