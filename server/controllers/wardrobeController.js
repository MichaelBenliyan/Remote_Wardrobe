const Wardrobe = require('../models/wardrobeModel');
const User = require('../models/userModel');

const wardrobeController = {};

wardrobeController.createClothing = (req, res, next) => {
    let wardrobeID;
    User.findOne({_id: req.cookies.ssid})
    .then(user => {
        wardrobeID = user.wardrobeID;
        //create Clothing
        const newClothing = new Wardrobe({type: req.fields.type, color: req.fields.color, subType: req.fields.subType, wardrobeID: wardrobeID});
        //save Clothing
        newClothing.save(function (err) {
            if (err) {
                return next({
                log: 'userController.createUser: ' + err,
                message: {error: 'userController.createUser: Error saving new Clothing'}
                });
            }
        });
        res.locals.fileName = newClothing._id;
        return next() 
    })
    .catch(err => {
        return next({
            log: 'wardrobeController.createClothing: ' + err,
            message: {error: 'wardrobeController.createClothing: Error finding User'}
        });
    });
};

wardrobeController.getImages = (req, res, next) => {
    const typeMatch = {
        'headWear': 'Head Wear', 
        'jacket': 'Jacket', 
        'top': 'Top', 
        'bottom': 'Bottom', 
        'shoes': 'Shoes'
    };
    let wardrobeID;
    let type = typeMatch[req.body.type];
    User.findOne({_id: req.cookies.ssid})
    .then(user => {
        wardrobeID = user.wardrobeID;
        Wardrobe.find({wardrobeID: wardrobeID, type: type})
        .then(data => {
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                console.log('data[i]: ',data[i])
                arr.push(data[i]._id)
            }
            res.locals.imgPaths = arr;
            
            return next();
        })
        .catch(err => {
            return next({
                log: 'wardrobeController.getImages: ' + err,
                message: {err: 'Error querying Wardrobe'}
            })
        });
    })
    .catch(err => {
        return next({
            log: 'wardrobeController.getImages: ' + err,
            message: {err: 'Error querying User'}
        });
    })
}

module.exports = wardrobeController;