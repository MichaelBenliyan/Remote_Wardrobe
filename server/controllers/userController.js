const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const workFactor = 10;
const userController = {};

let wardrobeID = 2;
userController.createUser = (req, res, next) => {
    console.log(req.fields);
    if (typeof(req.fields.username) === 'string' && typeof(req.fields.password) === 'string') {
      bcrypt.hash(req.fields.password, workFactor)
        .then(hash => {
          const newUser = new User({username: req.fields.username, password: hash, wardrobeID: wardrobeID});
          wardrobeID += 1;
          newUser.save(function (err) {
            if (err) {
              return next({
                log: 'userController.createUser: ' + err,
                message: {error: 'userController.createUser: Error saving new User'}
              });
            }
          });
          res.locals.id = newUser._id;
          return next() 
        })
        .catch(err => {
          return next({
            log: 'userController.createUser: ' + err,
            message: 'Something went wrong hashing'
          })
        });
    }
};

userController.verifyUser = (req, res, next) => {
// write code here
User.findOne({username : req.fields.username})
    .then(data => {
    // console.log(data)
    if(data === null){
        return next({
        log: 'userController.verifyUser',
        message: {err: 'userController.verifyUser'}
        })
    }
    else {
        //check password 
        bcrypt.compare(req.fields.password, data.password)
        .then((result) => {
            if(result) {
            res.locals.id = data._id
            return next();
            }
            else {
            return next({
                log: 'userController.verifyUser',
                message: 'invalid password',
                type: 'redirect',
                url: 'http://localhost:3000/signup'
            })
            }
        })
        .catch((err) => {
            return next({
            log: 'userController.verifyUser',
            message: 'error during comparison',
            })
        })
    }
    });
};

module.exports = userController;