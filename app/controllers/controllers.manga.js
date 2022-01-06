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
const ModelMangasChapters = require("../models/model.mangas_chapter")





/**Page d'ajout d'un manga */
exports.index = async (req, res) => {


    res.render('mangas/create')
}

exports.mangas_add = async (req, res) => {

    const cover = req.files.cover

    await cover.mv('public/uploads/covers/' + cover.name, err => {
        if (err)
            return res.status(500).send(err)
    });
    var cover_manga = '/uploads/covers/' + cover.name

    var body = {
        title: "Dr Stone",
        description: "Retour à la vie primitif sans la sience",
        author: "Toto",
        date: "2022-01-01",
        status: "En cours",
        category_id: 1

    }


    await ModelMangas.create({

        title: body.title,
        description: body.description,
        cover: cover_manga,
        author: body.author,
        date: body.date,
        status: body.status,
        score_total: 0,
        category_id: body.category_id,

    });


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
        title: 'Chapitre 1',
        manga_id: '1'
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

            res.redirect('/admin');

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