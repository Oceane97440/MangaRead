const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const fileUpload = require('express-fileupload');
const database = require('./app/config/database');

// Import des models 
const users = require('./app/models/models.users');

database
    .sequelize
    .sync();
sequelize = database.sequelize;
Sequelize = database.Sequelize;



/** view engine setup*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
app.use(express.static('files'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'MangaRead',
  keys: ['asq4b4PR'],
  maxAge: 2592000000 // 30 jour
}))


/**
 * @MidleWare
 * UTILISATEUR CONNECTÉ
 */

 app.get('/*', function (req, res, next) {
  res.locals.user = {}
  if (req.session.user) {

      res.locals.user.user_email = req.session.user.user_email;
      res.locals.user.user_role = req.session.user.user_role;

      //console.log(res.locals.user.user_email)
  }
  next();
});

app.post('/*', function (req, res, next) {
  res.locals.user = {}
  // nom de l'utilisateur connecté (dans le menu) accessible pour toutes les vues
  if (req.session.user) {
      res.locals.user.user_email = req.session.user.user_email;
      res.locals.user.user_role = req.session.user.user_role;
      //console.log(res.locals.user.user_email)
  }
  next();
});

//flash message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})





// Routes handler
const index = require('./app/routes/routes.index')
app.use('/', index);

app.set("port", process.env.PORT || 8890);


app.listen(app.get("port"), () => {
    console.log(`server on port ${app.get("port")}`);
});
