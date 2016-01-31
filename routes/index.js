var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.info == null){
    return res.render('login')
  }
  var app = req.param('app');
  var appName = req.param('appName');
  if(app != null){
    req.session.app = 'app' + app;
  }
  if(appName != null){
    req.session.appName = appName;
  }
  res.render('index');
});
module.exports = router;
