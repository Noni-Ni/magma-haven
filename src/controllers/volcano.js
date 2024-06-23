const { Router } = require("express");
const { body, validationResult } = require('express-validator')

const { getAll, getById, getByAuthorId, update } = require("../services/volcano");
const { isUser } = require("../middlewares/guards");
const { parseErrors } = require('../util');
const { create } = require("../services/volcano");

const volcanoRouter = Router();

volcanoRouter.get('/create', isUser(), (req, res) => {
    res.render('create');
});

volcanoRouter.post('/create', isUser(),
    body('name').trim().isLength({ min: 2 }),
    body('location').trim().isLength({ min: 3 }),
    body('elevation').trim().isInt({ min: 0 }),
    body('lastEruption').trim().isInt({ min: 0, max: 2024 }),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }),
    body('typeVolcano').trim(),
    body('description').trim().isLength({ min: 10 }),
    async (req, res) => {
        const userId = req.user._id;
        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }

            const result = await create(req.body, userId);
            res.redirect('/catalog')

        } catch (err) {
            res.render('create', { data: req.body, errors: parseErrors(err).errors });
        }

    }
);
volcanoRouter.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const data = await getById(id);
    if(!data){
        res.status(404).render('404');
        return;
    }

    if(data.author.toString() != req.user._id){
        res.redirect('/login');
    }
    res.render('edit', { data: data});
});

volcanoRouter.post('/edit/:id', isUser(),
    body('name').trim().isLength({min: 2}),
    body('location').trim().isLength({min: 3}),
    body('elevation').trim().isInt({min: 0}),
    body('lastEruption').trim().isInt({min: 0, max: 2024}),
    body('image').trim().isURL({require_tld: false, require_protocol: true}),
    body('typeVolcano').trim(),
    body('description').trim().isLength({min: 10}),
    async (req, res) => {
        const userId = req.user._id;
        const id = req.params.id;
        try {
            const validation = validationResult(req);

            if(validation.errors.length){
                throw validation.errors;
            }

            const result = await update( id, req.body, userId);
            res.redirect('/catalog/' + id)

        } catch (err) {
            res.render('edit', { data: req.body, errors: parseErrors(err).errors });
        }
       
    });



module.exports = { volcanoRouter };