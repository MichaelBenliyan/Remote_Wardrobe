const express = require('express');
const path = require('path');

const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.get('/',
    (req, res) => {
        res.sendFile(path.join(__dirname, '../../src/pages/signup.html'));
    }
)

router.post('/', 
    userController.createUser, 
    cookieController.setSSIDCookie, 
    sessionController.startSession, 
    (req, res) => {
        res.redirect('/wardrobe');
    });

module.exports = router;