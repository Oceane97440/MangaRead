const router = require("express").Router();


const mangas = require("../controllers/controllers.manga");

// Affiche la page lister des mangas
router.get("/", mangas.index);
/**Action add manga */
router.get("/create", mangas.mangas);
router.post("/create", mangas.mangas_add);
router.get("/fiche/:manga_id", mangas.mangas_view);
router.get("/categorie/:category_id", mangas.categorie);
/**Action add categorie*/
router.get("/category/create", mangas.category);
router.post("/category/create", mangas.category_add);


/**Action add chapitre au manga */
router.get("/chapter/create/:mangas_id", mangas.chapter);
router.post("/chapter/create", mangas.chapter_add);
router.get("/chapter/:manga_id", mangas.chapter_all);
/**Action add des pages au chapitre du manga */
router.get("/pages/create/:chapter_id", mangas.pages);
router.post("/pages/create", mangas.pages_add);
router.get("/pages/:chapter_id", mangas.pages_all);
/**Action leture du manga */
router.get('/:manga_id/page/:chapter_id',mangas.read);











module.exports = router;