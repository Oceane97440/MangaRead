const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const MangasChapters = sequelize.define('mangas_chapters', {
    									
    manga_chapter_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    manga_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    },
    chapter_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    }
    

}, {
    tableName: 'mangas_chapters',
    underscored: true,
    timestamps: false
});

module.exports = MangasChapters;