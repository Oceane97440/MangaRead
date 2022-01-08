const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const fileUpload = require('express-fileupload');
const paginate = require('express-paginate');

const database = require('./app/config/database');

// Import des models 
const users = require('./app/models/model.users');
const category = require('./app/models/model.category')
const mangas = require('./app/models/model.mangas')
const chapter = require('./app/models/model.chapter')
const pages = require('./app/models/model.pages')
const chapters_pages = require('./app/models/model.chapters_pages')
const users_mangas = require('./app/models/model.users_mangas')
const mangas_chapters = require('./app/models/model.mangas_chapter')



//un mangas attribuer un user un user posséde un à plusieurs manga en favoris
users.hasMany(users_mangas, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true
});
mangas.hasMany(users_mangas, {
  foreignKey: 'manga_id',
  onDelete: 'cascade',
  hooks: true
});

users_mangas.belongsTo(users, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true
});

users_mangas.belongsTo(mangas, {
  foreignKey: 'manga_id',
  onDelete: 'cascade',
  hooks: true
});





//un mangas attribuer un user un user posséde un à plusieurs manga en favoris
chapter.hasMany(chapters_pages, {
  foreignKey: 'chapter_id',
  onDelete: 'cascade',
  hooks: true
});
pages.hasMany(chapters_pages, {
  foreignKey: 'page_id',
  onDelete: 'cascade',
  hooks: true
});
chapters_pages.belongsTo(chapter, {
  foreignKey: 'chapter_id',
  onDelete: 'cascade',
  hooks: true
});

chapters_pages.belongsTo(pages, {
  foreignKey: 'page_id',
  onDelete: 'cascade',
  hooks: true
});




//un mangas attribuer un user un user posséde un à plusieurs manga en favoris

mangas.hasMany(mangas_chapters, {
  foreignKey: 'manga_id',
  onDelete: 'cascade',
  hooks: true
});
chapter.hasOne(mangas_chapters, {
  foreignKey: 'chapter_id',
  onDelete: 'cascade',
  hooks: true
});
mangas_chapters.belongsTo(chapter, {
  foreignKey: 'chapter_id',
  onDelete: 'cascade',
  hooks: true
});

mangas_chapters.belongsTo(mangas, {
  foreignKey: 'manga_id',
  onDelete: 'cascade',
  hooks: true
});


//un mangas possède une categorie


mangas.belongsTo(category, {
  foreignKey: 'category_id',
  onDelete: 'cascade',
  hooks: true
});





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
app.use(paginate.middleware(1, 50));
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

    res.locals.user.email = req.session.user.email;
    res.locals.user.username = req.session.user.username;
    res.locals.user.image = req.session.user.image;
    res.locals.user.role = req.session.user.role;

    console.log(res.locals.user)
  }
  next();
});

app.post('/*', function (req, res, next) {
  res.locals.user = {}
  // nom de l'utilisateur connecté (dans le menu) accessible pour toutes les vues
  if (req.session.user) {
    res.locals.user.email = req.session.user.email;
    res.locals.user.username = req.session.user.username;
    res.locals.user.image = req.session.user.image;
    res.locals.user.role = req.session.user.role;

    console.log(res.locals.user.email)
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
const manga = require('./app/routes/routes.manga')
app.use('/mangas', manga);

app.set("port", process.env.PORT || 8890);


app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});