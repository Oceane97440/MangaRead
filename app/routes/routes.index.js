const router = require("express").Router();


const index = require("../controllers/controllers.index");

// Affiche la page hp
router.get("/", index.index);
// Action d'inscription et connexion
router.get("/signup", index.signup);
router.post("/signup/add", index.signup_add);
router.get("/login", index.login);
router.post("/login/add", index.login_add);

// Action du user
router.get("/profil", index.profil);
router.get("/list/favoris", index.favoris);
router.post("/favoris", index.favoris_add);
router.get("/admin", index.admin);
router.get("/delete/:manga_id", index.delete);
router.get("/delete/chapter/:chapter_id", index.delete_chapter);
router.get("/delete/page/:page_id", index.delete_page);



router.post("/vote", index.vote);

router.get("/logout", index.logout);



module.exports = router;