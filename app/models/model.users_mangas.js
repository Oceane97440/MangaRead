const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const ChaptersPages = sequelize.define('users_mangas', {

    user_manga_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    },
    manga_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
    },
    score: {
        type: Sequelize.DECIMAL(),
        allowNull: false,
        defaultValue: 0

    },
    favori: {
        type: Sequelize.TINYINT(),
        allowNull: false,
        defaultValue: 0

    }


}, {
    tableName: 'users_mangas',
    underscored: true,
    timestamps: false
});

module.exports = ChaptersPages;