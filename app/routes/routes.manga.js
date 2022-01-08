const router = require("express").Router();


const mangas = require("../controllers/controllers.manga");

// Affiche la page Index
router.get("/", mangas.index);
router.post("/create", mangas.mangas_add);
router.get("/chapter/create/:mangas_id", mangas.chapter);
router.post("/chapter/create", mangas.chapter_add);
router.get("/chapter/:manga_id", mangas.chapter_all);
router.get("/pages/create/:chapter_id", mangas.pages);
router.post("/pages/create", mangas.pages_add);
router.get("/pages/:chapter_id", mangas.pages_all);
router.get("/fiche/:manga_id", mangas.mangas_view);
// router.get("/read/:chapter_id", mangas.read);



router.get('/page/:chapter_id',mangas.pagination);











module.exports = router;