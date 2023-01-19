const Session = require('../models/sessionModel');

const sessionController = {};

/**
* isLoggedIn - find the appropriate session for this request in the database, then
* verify whether or not the session is still valid.
*/
sessionController.isLoggedIn = (req, res, next) => {
  if (!req.cookies) {
    return next({
        type: 'sendToLogin', 
        log: 'sessionController.isLoggedIn: Cookie Not Found',
        message: {err: 'User does not have a cookie'}
      });
  }
  Session.findOne({cookieId: req.cookies.ssid})
    .then(data => {
      //found session, Success
      if (data !== null)return next();
      //did not find session
      else {
        return next({
          type: 'sendToLogin', 
          log: 'sessionController.isLoggedIn: Session Not Found',
          message: {err: 'User does not have an active session'}
        });
      }
    })
    .catch (err => {
      return next({
        log: 'sessionController.isLoggedIn: ' + err,
        message: {err: 'Something went wrong in the querry'}
      });
    });
};

/**
* startSession - create and save a new Session into the database.
*/
sessionController.startSession = (req, res, next) => {
  //write code here
  try {
    const newSession = new Session({cookieId: res.locals.id});
    newSession.save(function (err) {
      if(err) {
        return next ({
          log: 'sessionController.startSession ' + err,
          message: {err: 'sessionController.startSession: Error saving sesssion'}
        });
      }
    });
    return next();
  }
  catch (err){
    return next({
      log: 'sessionController.startSession ' + err,
      message: {err: 'sessionController.startSession: Error creating sesssion'}
    })
  }
};

module.exports = sessionController;
