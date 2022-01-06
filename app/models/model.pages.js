const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const Pages = sequelize.define('pages', {
    									
    page_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numbre_page: {
        type: Sequelize.INTEGER(),
        allowNull: false
    },
    scan: {
        type: Sequelize.STRING(),
        allowNull: false
    }
    

}, {
    tableName: 'pages',
    underscored: true,
    timestamps: false
});

module.exports = Pages;