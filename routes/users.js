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

router.get('/register',function(req,res){
    console.log("11223344")
    var id = req.query('id');
    var user = {"id":id,"phonenum":id};
    var code=Util.SUCCESS;
    User.query(id,function(err,dbres){
        if(dbres!=null&&dbres.length!=0){
            code=3;
        }
        if(code!=Util.SUCCESS){
            return res.send({"code":code,"failure":"账号已存在"});
        }else{
            User.insert(user,function(err,dbres){
                return res.send({"code":code,"failure":""})
            })
        }
    });
});

router.get('/login',function(req,res){
    var id = req.query("id");
    var password = req.query("password");
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

