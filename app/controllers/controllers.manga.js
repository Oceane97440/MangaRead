const bcrypt = require('bcrypt');
const {
    Op
} = require("sequelize");
const validator = require('validator');
const fs = require('fs');
const Utilities = require('../functions/functions.utilities');


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





/**Page d'ajout d'un manga */
exports.index = async (req, res) => {


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


    console.log(data.mangas_chapters)

    res.render("mangas/view_mangas", data)

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