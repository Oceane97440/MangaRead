const router = require("express").Router();


const index = require("../controllers/controllers.index");

// Affiche la page Index
router.get("/", index.index);
router.get("/signup", index.signup);
router.post("/signup/add", index.signup_add);
router.get("/login", index.login);
router.post("/login/add", index.login_add);
router.get("/list/favoris", index.favoris);
router.post("/favoris", index.favoris_add);
router.get("/logout", index.logout);


router.get("/admin", index.admin);
router.post("/vote", index.vote);




/** 


router.get("/home_page", index.index);
router.get("/logout", index.logout)*/ 

module.exports = router;