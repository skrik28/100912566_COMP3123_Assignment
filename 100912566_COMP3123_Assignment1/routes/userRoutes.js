const express = require('express');
const { signup, login } = require('../controllers/userController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/signup', [
    body('username').notEmpty().withMessage('Username is required.'),
    body('email').isEmail().withMessage('Invalid email format.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    await signup(req, res);
});

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format.'),
    body('password').notEmpty().withMessage('Password is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    await login(req, res);
});

module.exports = router;
