const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const ChaptersPages = sequelize.define('chapters_pages', {
    									
    chapter_page_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    chapter_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    },
    page_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    }
    

}, {
    tableName: 'chapters_pages',
    underscored: true,
    timestamps: false
});

module.exports = ChaptersPages;