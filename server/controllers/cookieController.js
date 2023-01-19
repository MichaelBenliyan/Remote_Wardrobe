const cookieController = {};

/**
* setSSIDCookie - store the user id in a cookie
*/
cookieController.setSSIDCookie = (req, res, next) => {
  if (res.locals.id) {
    res.cookie('ssid', res.locals.id, { httpOnly: true });
    return next()
  }
  else {
    return next({
      log: 'cookieController.setSSIDCookie: ',
      message: {err: 'cookieController.setSSIDCookie'}
    });
  }
}


module.exports = cookieController;