const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const Category = sequelize.define('category', {
    									
    category_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    label: {
        type: Sequelize.STRING(),
        allowNull: false
    }
}, {
    tableName: 'category',
    underscored: true,
    timestamps: false
});

module.exports = Category;