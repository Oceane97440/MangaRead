const router = require("express").Router();


const mangas = require("../controllers/controllers.manga");

// Affiche la page Index
router.get("/", mangas.index);
router.post("/create", mangas.mangas_add);
router.get("/chapter/create/:mangas_id", mangas.chapter);
router.get("/chapter/create", mangas.chapter_add);








module.exports = router;