const router = require("express").Router();


const mangas = require("../controllers/controllers.manga");

// Affiche la page Index
router.get("/", mangas.index);
router.post("/create", mangas.mangas_add);
router.get("/chapter/create/:mangas_id", mangas.chapter);
router.post("/chapter/create", mangas.chapter_add);
router.get("/chapter/:manga_id", mangas.chapter_all);
router.get("/pages/:chapter_id", mangas.pages);
router.post("/pages/create", mangas.pages_add);











module.exports = router;