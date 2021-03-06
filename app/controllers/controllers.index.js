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


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;

/**Page accueil */
exports.index = async (req, res) => {
    const data = new Object();
    data.mangas = await ModelMangas.findAll({
        where: {
            score_total: {
                [Op.gte]: 1
            }
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
    res.render('landingpage', data)
}


/**Page d'inscription */
exports.signup = async (req, res) => {

    res.render('users/signup')
}


exports.signup_add = async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const avatar = req.files.image



    try {

        // verifier si les champs ne son pas vide
        if (Utilities.empty(email) || Utilities.empty(password) || Utilities.empty(username) || Utilities.empty(avatar)) {
            req.session.message = {
                type: 'danger',
                intro: 'Erreur',
                message: 'Les champs avec un ast??risque * sont obligatoires'
            }
            return res.redirect('/signup');
        }

        // verifie si email est valide avec le regex
        if (!EMAIL_REGEX.test(email)) {
            req.session.message = {
                type: 'danger',
                intro: 'Erreur',
                message: 'Email invalide'
            }
            return res.redirect('/signup');
        }

        // verifie si le password contien entre min 4 et max 8 carat??re + un number
        if (!PASSWORD_REGEX.test(password)) {
            req.session.message = {
                type: 'danger',
                intro: 'Erreur',
                message: 'Le mot de passe doit ??tre compris entre 4 et 8 carat??res avec 1 chiffre et un carat??re sp??cial'
            }
            return res.redirect('/signup');
        }


        /**Verifie extention du fichier avant envoie */

        if (!Utilities.empty(req.files.image)) {


            if ((avatar.mimetype == 'image/png') ||
                (avatar.mimetype == 'image/jpg') ||
                (avatar.mimetype == 'image/jpeg')) {


                fs.mkdir('public/uploads/profil/', {
                    recursive: true
                }, (err) => {
                    if (err)
                        throw err;
                });

                await avatar.mv('public/uploads/profil/' + avatar.name, err => {
                    if (err)
                        return res.status(500).send(err)
                });
                var image_file = '/uploads/profil/' + avatar.name

            } else {
                req.session.message = {
                    type: 'danger',
                    intro: 'Erreur',
                    message: "Extention du fichier invalide"

                }
                return res.redirect('/signup');

            }
        } else {
            image_file = '/admin/img/user-circle-solid.svg'
        }




        // search si email exsite d??j?? dans le bdd

        await ModelUser.findOne({
            attributes: ['email'],
            where: {
                email: email
            }
        }).then(async function (userFound) {

            if (!userFound) {
                //validator + bycrypt
                const hashedPwd = await bcrypt.hash(password, 12);
                const user = await ModelUser.create({
                    username: validator.escape(username),
                    email: validator.normalizeEmail(email),
                    password: hashedPwd,
                    image: image_file,
                    role: 0,
                });

                res.redirect('/login');

            } else {
                req.session.message = {
                    type: 'danger',
                    intro: 'Erreur',
                    message: 'Email est d??j?? utilis??'
                }
                return res.redirect('/signup');
            }

        });



    } catch (error) {
        console.log(error)
    }

}

/**Page de connexion */

exports.login = async (req, res) => {

    res.render('users/login')
}

exports.login_add = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;



    try {
        // verifie si les donn??e son correcte et non null 
        if (email == '' || password == '') {
            req.session.message = {
                type: 'danger',
                intro: 'Erreur',
                message: 'Email ou mot passe est incorrect'
            }
            return res.redirect('/login');
        }

        // verifie si le email est pr??sent dans la base
        ModelUser.findOne({
            where: {
                email: email
            }
        }).then(async function (user) {
            // si email trouv??
            if (user) {
                //console.log(user)
                // on verifie si l'utilisateur ?? utiliser le bon mot de passe avec bcrypt
                const isEqual = await bcrypt.compare(password, user.password);
                // Si le mot de passe correpond au carat??re hash??
                if (isEqual) {
                    if (user.email !== email && user.password !== password) {
                        res.redirect('/login');
                    } else {

                        // use session for user connected
                        req.session.user = user;

                        // console.log(req.session)

                        if (req.session.user.role === 1) {


                            res.redirect("/admin")

                        } else {
                            res.redirect('/list/favoris');

                        }

                    }

                } else {
                    req.session.message = {
                        type: 'danger',
                        intro: 'Erreur',
                        message: 'Adresse email ou mot de passe invalide"'
                    }
                    return res.redirect('/login');
                }

            } else {
                req.session.message = {
                    type: 'danger',
                    intro: 'Erreur',
                    message: 'Adresse email ou mot de passe invalide'
                }
                return res.redirect('/login');
            }

        })

    } catch (error) {
        // console.log(error);
        res.redirect('/login');
    }

}

exports.profil = async (req, res) => {

    const data = new Object()
    data.user = await ModelUserManga.findOne({
        where: {
            user_id: req.session.user.user_id
        },
        include: [{
            model: ModelUser
        }, {
            model: ModelMangas
        }]
    })
    data.utilities = Utilities

    res.render('users/profil', data)
}

exports.logout = async (req, res) => {

    req.session = null
    res.redirect('/')
}

exports.favoris = async (req, res) => {

    const data = new Object()

    data.list_favorie = await ModelUserManga.findAll({
        where: {
            favoris: true,
            user_id: req.session.user.user_id,
        },
        include: [{
                model: ModelMangas
            },
            {
                model: ModelUser
            }
        ]
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


    res.render('users/favoris', data)
}


exports.favoris_add = async (req, res) => {

    //console.log(req.session.user)
    // console.log(req.body)

    const data = new Object()
    await ModelUserManga.findOne({
        where: {
            user_id: req.session.user.user_id,
            manga_id: req.body.manga_id,

        }
    }).then(async function (usermangaFound) {

        if (usermangaFound) {

            await ModelUserManga.update({
                favoris: req.body.favoris
            }, {
                where: {
                    user_manga_id: usermangaFound.user_manga_id
                }
            });
        } else {
            await ModelUserManga.create({

                user_id: req.session.user.user_id,
                manga_id: req.body.manga_id,
                favoris: req.body.favoris
            })
        }
    })


}

exports.admin = async (req, res) => {

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
    data.utilities = Utilities

    res.render('admin/dashboard', data)
}
exports.delete = async (req, res) => {

    const manga_id = req.params.manga_id
    //console.log(manga_id)

    await ModelMangas.findOne({
        where: {
            manga_id: manga_id,

        }
    }).then(async function (mangaFound) {

        if (mangaFound) {

            await ModelMangas.destroy({
                where: {
                    manga_id: manga_id
                }
            });

            await ModelMangasChapters.destroy({
                where: {
                    manga_id: manga_id
                }
            })

            await ModelChapter.destroy({
                where: {
                    manga_id: manga_id
                }
            })

             res.redirect('/admin')
        }
    })

}

exports.delete_chapter = async (req, res) => {

    const chapter_id = req.params.chapter_id
    //console.log(manga_id)

    await ModelChapter.findOne({
        where: {
            chapter_id: chapter_id,

        }
    }).then(async function (chapterFound) {

        if (chapterFound) {
            await ModelChapter.destroy({
                where: {
                    chapter_id: chapter_id
                }
            });

            await ModelChapterPage.destroy({
                where: {
                    chapter_id: chapter_id
                }
            })

         
             res.redirect(`/mangas/chapter/${chapterFound.manga_id}`)
        }
    })

}
exports.delete_page = async (req, res) => {

    const page_id = req.params.page_id
    //console.log(manga_id)

    await ModelChapterPage.findOne({
        where: {
            page_id: page_id,

        }
    }).then(async function (pageFound) {

        if (pageFound) {
            await ModelPage.destroy({
                where: {
                    page_id: page_id
                }
            });

            await ModelChapterPage.destroy({
                where: {
                    page_id: page_id
                }
            })

         
             res.redirect(`/mangas/pages/${pageFound.chapter_id}`)
        }
    })

}

exports.vote = async (req, res) => {
    // console.log(req.session.user)
    // console.log(req.body)



    await ModelUserManga.findOne({
        where: {
            user_id: req.session.user.user_id,
            manga_id: req.body.manga_id,

        }
    }).then(async function (usermangaFound) {

        if (usermangaFound) {
            await ModelUserManga.update({
                score: req.body.vote,
            }, {
                where: {
                    user_manga_id: usermangaFound.user_manga_id
                }
            });




        } else {
            await ModelUserManga.create({

                user_id: req.session.user.user_id,
                manga_id: req.body.manga_id,
                score: req.body.vote,

            })
        }

    })


}