const dotenv = require("dotenv");
dotenv.config({path:"./config.env"})

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB,process.env.USER_DB,process.env.PASSWORD, { // nom de la BDD, username, password
    host: process.env.HOST,
  //  port:8889,
    dialect: "mysql",
    operatorsAliases: true,

    logging: false,
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true
    },
    //timezone: '+04:00', for writing to database
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

module.exports = database;