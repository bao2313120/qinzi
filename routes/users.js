var express = require('express');
var router = express.Router();
var db = require('../db');
var User = require('../model/User');
var ResBody = require('../model/ResBody');
var Like = require('../model/Like');
var Util = require('../util');

module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!!!');
});

router.post('/register',function(req,res){
    var id = req.body.id;
    var password = req.body.password;
    var petname = req.body.petname;
    var user = {"id":id,"phonenum":id,"password":password,"petname":petname};
    var code=Util.SUCCESS;
    var body={};
    User.query(id,function(err,dbres){
        Util.errWarn(err);
        if(dbres!=null&&dbres.length!=0){
            body.code=3;
            body.failure="账号已存在"
        }
        if(code!=Util.SUCCESS){
            return res.send(body);
        }else{
            User.insert(user,function(err,dbres){
                Util.errWarn(err);
                body.code=code;
                body.failure="";
                return res.send(body);
            })
        }
    });
});

router.post('/login',function(req,res){
    var id = req.body.id;
    var password = req.body.password;
    var body={"data":[],"code":Util.SUCCESS,"failure":""};
    User.query(id,function(err,dbres){
        if(dbres==null||dbres.length==0){
            body.code=4;
            body.failure="用户不存在";
            return res.json(body);
        }
        var user=dbres[0];
        var userpassword=user.password;
        if(userpassword!=password){
            body.code = 5;
            body.failure="密码错误";
            return res.json(body);
        }else{
            var resUser={};
            resUser.name=user.name;
            resUser.petname=user.petname;
            var res1={};
            res1.user=resUser;
            body.data.push(res1);
            return res.json(body);
        }
    })
});
//我的收藏夹
router.get('/getmycollect',function(req,res){
    var body = new ResBody();
    var id=req.query.id;
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    Like.getAllGoodsLikeByIdAndIsLike(id,Util.LIKE_YES,function(err,dbres){
        body.data=dbres;
        return res.json(body);
    })
})

router.get('/getuserinfo',function(req,res){
    var id=req.query.id;
    var body = new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }

    User.query(id,function(err,dbres){
        body.data=dbres;
        return res.json(body);
    })
})

