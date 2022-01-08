const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const Chapters = sequelize.define('chapters', {
    									
    chapter_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    manga_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    }
}, {
    tableName: 'chapters',
    underscored: true,
    timestamps: false
});

module.exports = Chapters;