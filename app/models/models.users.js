const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const Users = sequelize.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    image: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    role: {
        type: Sequelize.INTEGER(),
        allowNull: true
    }

}, {
    tableName: 'users',
    underscored: true,
    timestamps: false
});

module.exports = Users;