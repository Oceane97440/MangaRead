const bcrypt = require('bcrypt');
const {
    Op
} = require("sequelize");
const validator = require('validator');
const fs = require('fs');
const Utilities = require('../functions/functions.utilities');
const paginate = require('express-paginate');


const ModelUser = require("../models/model.users")
const ModelMangas = require("../models/model.mangas")
const ModelChapter = require("../models/model.chapter")
const ModelPage = require("../models/model.pages")
const ModelCategory = require("../models/model.category")
const ModelUserManga = require("../models/model.users_mangas")
const ModelChapterPage = require("../models/model.chapters_pages")
const ModelMangasChapters = require("../models/model.mangas_chapter");
const {
    match
} = require('assert');


exports.index = async (req, res) => {


    const data = new Object();
    data.mangas = await ModelMangas.findAll({
        include: [{
            model: ModelCategory
        }]
    });

    data.mangas_chapter = await ModelMangasChapters.findAll({
        include: [{
            model: ModelChapter
        }]
    })


    data.shonen = await ModelMangas.findAll({
        where: {
            category_id: 1
        }
    });
    data.shojo = await ModelMangas.findAll({
        where: {
            category_id: 2
        }
    });


    data.seinen = await ModelMangas.findAll({
        where: {
            category_id: 3
        }
    });

    data.yaoi = await ModelMangas.findAll({
        where: {
            category_id: 4
        }
    });
    data.yuri = await ModelMangas.findAll({
        where: {
            category_id: 5
        }
    });

    data.utilities = Utilities

    res.render('mangas/list_mangas', data)
}


/**Page d'ajout d'un manga */
exports.mangas = async (req, res) => {


    const data = new Object();
    data.categories = await ModelCategory.findAll({

    });

    res.render('mangas/create', data)
}

exports.mangas_add = async (req, res) => {

    const cover = req.files.cover

    await cover.mv('public/uploads/covers/' + cover.name, err => {
        if (err)
            return res.status(500).send(err)
    });
    var cover_manga = '/uploads/covers/' + cover.name

    var body = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        date: req.body.date,
        status: req.body.status,
        category_id: req.body.category_id,

    }

    console.log(req.body)

    await ModelMangas.create({

        title: body.title,
        description: body.description,
        cover: cover_manga,
        author: body.author,
        date: body.date,
        status: body.status,
        score_total: 0,
        category_id: body.category_id,

    }).then(() => {

        res.redirect('/admin')
    })


}

exports.mangas_view = async (req, res) => {
    console.log(req.session.user)

    const data = new Object()
    data.mangas_chapters = await ModelMangasChapters.findAll({
        where: {
            manga_id: req.params.manga_id
        },
        include: [{
            model: ModelMangas,


        }, {
            model: ModelChapter
        }]
    })

    data.mangas = await ModelMangas.findOne({
        where: {
            manga_id: req.params.manga_id
        },
        include: [{
            model: ModelCategory
        }]
    })

    data.mangas_user = await ModelUserManga.findOne({
        where: {
            manga_id: req.params.manga_id,
            user_id: req.session.user.user_id
        }
    })

    var score = await ModelUserManga.sum('score', {
        where: {
            manga_id: req.params.manga_id,
        }
    })

    const score_total = (score / 5)

    await ModelMangas.update({
        score_total: score_total,
    }, {
        where: {
            manga_id: req.params.manga_id,
        }
    });

    var total = await ModelUserManga.findAll({
        attributes: ['score'],
        where: {
            manga_id: req.params.manga_id,
        }
    });

    data.total_vote = total.length
    data.score_total = score_total

    console.log(score_total)

    res.render("mangas/view_mangas", data)

}

exports.categorie = async (req, res) => {

    const data = new Object()

    data.mangas = await ModelMangas.findAll({
        where: {
            category_id: req.params.category_id
        },
        include: [{
            model: ModelCategory
        }]
    });

    data.mangas_chapter = await ModelMangasChapters.findAll({
        include: [{
            model: ModelChapter
        }]
    })


    res.render("mangas/list_category", data)


}


exports.chapter = async (req, res) => {


    console.log("OK")
    console.log(req.params.mangas_id)
    const data = new Object();
    data.manga = await ModelMangas.findOne({
        where: {
            manga_id: req.params.mangas_id
        }
    });

    res.render("mangas/create_chapter", data)
}

exports.chapter_add = async (req, res) => {


    var body = {
        title: req.body.title,
        manga_id: req.body.manga_id
    }
    console.log(req.body)



    await ModelMangas.findOne({
        attributes: ['manga_id'],
        where: {
            manga_id: body.manga_id
        }
    }).then(async function (mangaFound) {

        if (mangaFound) {
            const chapter = await ModelChapter.create({
                title: body.title,
                manga_id: body.manga_id
            });


            console.log(chapter.chapter_id)

            await ModelMangasChapters.create({
                manga_id: body.manga_id,
                chapter_id: chapter.chapter_id
            });

            res.redirect(`/mangas/chapter/${body.manga_id}`);

        } else {
            req.session.message = {
                type: 'danger',
                intro: 'Erreur',
                message: "Le manga n'existe pas"
            }
            return res.redirect('/');
        }

    });

}

exports.chapter_all = async (req, res) => {



    const data = new Object();
    const chaptersIds = new Array()
    data.mangas_chapters = await ModelMangasChapters.findAll({

        where: {
            manga_id: req.params.manga_id
        },
        include: [{
                model: ModelMangas

            },
            {
                model: ModelChapter,

            }
        ]

    });

    for (i = 0; i < data.mangas_chapters.length; i++) {
        chaptersIds.push(data.mangas_chapters[i].chapter_id);
    }



    data.chapter_pages = await ModelChapterPage.findAll({
        where: {
            chapter_id: chaptersIds
        },
        include: [{
            model: ModelPage

        }, {
            model: ModelChapter
        }]
    })






    res.render('mangas/list_chapter', data)

}


exports.pages = async (req, res) => {


    const chapter_id = req.params.chapter_id

    const data = new Object();
    data.chapter = await ModelChapter.findOne({
        where: {
            chapter_id: chapter_id
        }
    });

    res.render("mangas/create_page", data)
}

exports.pages_add = async (req, res) => {
    console.log(req.body)

    const chapter_id = req.body.chapter_id

    await ModelMangasChapters.findOne({
        where: {
            chapter_id: chapter_id
        },
        include: [{
            model: ModelMangas

        }, {
            model: ModelChapter
        }]
    }).then(async function (chapterFound) {

        if (chapterFound) {
            console.log(chapterFound)
            // Créer un dossier si celui-ci n'existe pas
            fs.mkdir('public/uploads/scans/' + chapterFound.manga.title + '/', {
                recursive: true
            }, (err) => {
                if (err)
                    throw err;
            });


            if (req.files) {

                const file = req.files.scan;
                for (let i = 0; i < file.length; i++) {

                    await file[i].mv('public/uploads/scans/' + chapterFound.manga.title + '/' + file[i].name, err => {
                        if (err)
                            return res.status(500).send(err)
                    });
                    const scan = '/uploads/scans/' + chapterFound.manga.title + '/' + file[i].name


                    console.log(scan)

                    const regex = file[i].name.match(/[0-9]/igm)
                    const numbre_page = regex[1]


                    const page = await ModelPage.create({
                        numbre_page: numbre_page,
                        scan: scan,
                    })


                    console.log(page.page_id)

                    await ModelChapterPage.create({
                        chapter_id: chapter_id,
                        page_id: page.page_id

                    });


                }
                res.redirect(`/mangas/chapter/${chapterFound.manga_id}`);

            }

        }
    })



}

exports.pages_all = async (req, res) => {

    const data = new Object();


    data.chapter_pages = await ModelChapterPage.findAll({
        where: {
            chapter_id: req.params.chapter_id
        },
        include: [{
            model: ModelPage

        }, {
            model: ModelChapter
        }]
    })


    data.mangas_chapters = await ModelMangasChapters.findOne({
        where: {
            chapter_id: req.params.chapter_id
        },
        include: [{
            model: ModelMangas

        }, {
            model: ModelChapter
        }]
    })







    res.render('mangas/list_pages', data)

}


exports.read = async (req, res) => {

    const chapter_id = req.params.chapter_id
    const manga_id = req.params.manga_id

    ModelChapterPage.findAndCountAll({

            include: [{
                    model: ModelChapter,
                    where: {
                        chapter_id: chapter_id,
                        [Op.and]: [{
                            manga_id: manga_id
                        }],
                    }

                },
                {
                    model: ModelPage
                }
            ],
            limit: 1,
            offset: req.skip
        })
        .then(async function (results) {


            // console.log(results.rows)
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            var next = await ModelChapter.max('chapter_id', {
                where: {
                    chapter_id: {
                        [Op.notIn]: [chapter_id],
                    },
                    manga_id: manga_id
                }



            })

            var preview = await ModelChapter.min('chapter_id', {

                where: {
                    chapter_id: {
                        [Op.notIn]: [chapter_id],
                    },
                    manga_id: manga_id
                }


            })
            // console.log(chapter_id)
            // console.log(preview)

            if (next <= chapter_id) {
                next = chapter_id
            } else {
                next = (parseInt(chapter_id) + 1)
            }
            if (preview >= chapter_id) {
                preview = (parseInt(chapter_id) - 1)
            }

            res.render('mangas/read', {
                chapters_pages: results.rows,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                chapter_id: chapter_id,
                next: next,
                preview: preview

            });
        })

}