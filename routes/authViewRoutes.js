const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', (req, res) => res.render('auth/register'));
router.get('/forgot', (req, res) => res.render('auth/forgot', { sent: false, token: null }));

module.exports = router;