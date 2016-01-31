var express = require('express');
var router = express.Router();
var User = require('../model/User');

router.get('/', function(req, res) {
    //console.log(req.cookies);
    res.render('login');
});

router.post('/submit', function(req, res) {
    var name = req.body.name;
    var pwd = req.body.pwd;
    var remember = req.body.remember;
    User.login(name, pwd, function(err, dbRes){
        if(err ||dbRes==null||dbRes.length==0){
            return res.end('用户名或者密码错误');
        }else{
            //cookie
            if(remember == 'true'){
                res.setHeader("Set-Cookie", ['name=' + name, 'pwd=' + pwd]);
            }
            //set session
            req.session.info = {
                name : name,
                apps : dbRes
            };
            res.end('success');
        }
    });
});

router.get('/getSession', function(req, res){
    return res.json(req.session);
});

router.post('/quit', function(req, res){
    req.session.destroy();
    res.end();
});

module.exports = router;