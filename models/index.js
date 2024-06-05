const sequelize = require('../config/database');
const User = require('./User');
const Transaction = require('./Transaction');

const syncModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await User.sync();
        await Transaction.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

syncModels();

module.exports = {
    User,
    Transaction
};
