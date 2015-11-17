var express = require('express');
var router = express.Router();
var db = require('../db');
var User = require('../model/User');
var Util = require('../util');


module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!!!');
});

router.post('/register',function(req,res){
    console.log("11223344")
    var id = req.body.id;
    var password = req.body.password;
    var user = {"id":id,"phonenum":id,"password":password};
    var code=Util.SUCCESS;
    User.query(id,function(err,dbres){
        Util.errWarn(err);
        if(dbres!=null&&dbres.length!=0){
            code=3;
        }
        if(code!=Util.SUCCESS){
            return res.send({"code":code,"failure":"账号已存在"});
        }else{
            User.insert(user,function(err,dbres){
                Util.errWarn(err);
                return res.send({"code":code,"failure":""})
            })
        }
    });
});

router.post('/login',function(req,res){
    var id = req.body.id;
    var password = req.body.password;
    var code = Util.SUCCESS;
    User.query(id,function(err,dbres){
        if(dbres==null||dbres.length==0){
            code=4;
            return res.json({"code":code,"failure":"用户不存在"});
        }
        var user=dbres[0];
        var userpassword=user.password;
        if(userpassword!=password){
            code = 5;
            return res.json({"code":code,"failure":"密码错误"});
        }else{
            return res.json({"code":code,"failure":""});
        }
    })
});

