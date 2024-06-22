const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const { createToken } = require('../services/jwt');
const { isGuest } = require('../middlewares/guards');
const { login , register} = require('../services/user');
const { parseErrors } = require('../util');


const userRouter = Router();

userRouter.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

userRouter.post('/login', isGuest(),
    body('email').trim(),
    body('password').trim(),
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await login(email, password);
            const token = createToken(result);
            res.cookie('token', token);
            res.redirect('/');
        } catch (error) {
            res.render('login', { data: { email }, errors: parseErrors(error).errors});
        }

    });

userRouter.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

userRouter.post('/register', isGuest(), 
    body('email').trim().isLength({min: 10}).isEmail(),
    body('username').trim().isLength({min: 2}),
    body('password').trim().isLength({min: 4}),
    body('repass').trim().custom((value, { req }) => value == req.body.password).withMessage('Passwords don\'t match'),
    async (req, res) => {
        const { email, username , password } = req.body;
        try {
            const result = validationResult(req);

            if (result.errors.length) {
                throw result.errors;
            }

            const user = await register(email, username, password);
            const token = createToken(user);

            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
            
        } catch (err) {
            res.render('register', { data: { email, username }, errors: parseErrors(err).errors });
            return;
        }
    }

    
);

userRouter.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = {
    userRouter
}