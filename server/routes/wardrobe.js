const express = require('express');
const path = require('path');

const wardrobeController = require('../controllers/wardrobeController');


const router = express.Router();

router.get('/',
    (req, res) => {
        console.log('test')
        res.sendFile(path.join(__dirname, '../../src/pages/wardrobe.html'));
    }
)

router.post('/', 
    wardrobeController.createClothing, 
    (req, res) => {
        res.sendStatus(200);
    });

module.exports = router;