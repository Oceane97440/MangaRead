const Sequelize = require('sequelize');

const sequelize = require('../config/database').sequelize;

const Mangas = sequelize.define('mangas', {
    									
    manga_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(),
        allowNull: true
    },
    cover: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    author: {
        type: Sequelize.STRING(),
        allowNull: true
    },
    date: {
        type: Sequelize.DATE(),
        allowNull: true
    } ,
    status: {
        type: Sequelize.STRING(),
        allowNull: true
    },
    score_total: {
        type: Sequelize.STRING(),
        allowNull: true,
        defaultValue: 0

    },
    category_id: {
        type: Sequelize.INTEGER(),
        allowNull: true
    }
}, {
    tableName: 'mangas',
    underscored: true,
    timestamps: false
});

module.exports = Mangas;