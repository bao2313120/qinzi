var express = require('express');
var router = express.Router();
var db = require('../db');
var User = require('../model/User');
var ResBody = require('../model/ResBody');
var Like = require('../model/Like');
var Goods = require('../model/Goods');
var Util = require('../util');
var util = require('util');
var formidable = require('formidable');
var fs = require('fs');
var async = require('async');
var config  = require('config');
var Question = require('../model/Question');
var m= require('connect-multiparty');
var pingpp = require('pingpp')('sk_live_yDGq1OTOSGCCbz5iHCrb50K4');
module.exports = router;


var multipartMiddleware = m();
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
        var data=[];
        async.eachSeries(dbres,function(userLike,cb){
            Goods.getGoodsByGoodsId(userLike.goodsid,function(err,goodsArr){
                if(goodsArr.length>0){
                    var goods=goodsArr[0];
                    goods.support=goods.support+goods.actsupport;
                    goods.issupport=Util.LIKE_YES;
                    data.push(goods);
                }
                cb(null,null);
            })
        },function(err){
            body.data=data;
            return res.json(body);
        })
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

router.post('/updateAddressPhoneNum',function(req,res){
    var address=req.body.address;
    var phone=req.body.phone;
    var id = req.body.id;
    var body = new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    User.updateAddressAndPhone(id,address,phone,function(err,dbres){
        return res.json(body);
    })
})

router.post('/uploadHeadPic',function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = config.updatetmppath;
    var body=new ResBody();
    var id=req.header('UserId');
    console.info(id);
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    form.parse(req,function(err,fields,files){
        var body=new ResBody();
        console.log(util.inspect(files));
        async.eachSeries(files,function(file,cb){
            var fileName = Util.getFileName(file);
            var updateDir = config.updatepath+fileName;
            fs.rename(file.path,updateDir,function(err){
                console.log(err);
                var loadPath=config.pefiximage+fileName;
                User.updateHeadPic(id,loadPath,function(err,dbres){
                    if(err){
                        body.code=Util.FAIL;
                    }
                    cb(null,null);
                })
            });
        },function(err){
            var data={};
            User.query(id,function(err,user){
                data.user=user;
                body.data.push(data);
                res.json(body);
            })

        })
    })
})

router.post('/updatePetName',function(req,res){
    var id = req.body.id;
    var petname = req.body.petname;
    var body=new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    User.updatePetName(id,petname,function(err,dbres){
        res.json(body);
    })
})

router.post('/updateEmail',function(req,res){
    var id = req.body.id;
    var email = req.body.email;
    var body=new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    User.updateEmail(id,email,function(err,dbres){
        res.json(body);
    })
})

router.post('/updatephone',function(req,res){
    var id=req.body.id;
    var body=new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    var phone = req.body.phone;
    User.updatePhone(id,phone,function(err,dbres){
        res.json(body);
    })
})

router.post('/updatePassWord',function(req,res){
    var id=req.body.id;
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var body=new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    User.query(id,function(err,user){
        if(user==null){
            body.code=Util.FAIL;
            return res.json(body);
        }
        if(user.password!=oldpassword){
            body.code=Util.ERR_OLDPASSWORD;
            body.failure=Util.ERR_OLDPASSWORD_FAILURE;
            return res.json(body);
        }
        User.updatePassWord(id,newpassword,oldpassword,function(err,dbres){
            return res.json(body);
        })
    })
})

router.get('/getviplist',function(req,res){
    var id = req.query.id;
    var body = new ResBody();
    var data={};
    User.getVipList(function(err,dbres){
        data.viplist=dbres;
        body.data.push(data);
        return res.json(body);
    })
})

router.get('/getVipPage',function(req,res){
    var id = req.query.id;
    var viplevelid = Number(req.query.viplevelid);
    User.getVipLevelPage(viplevelid,function(err,dbres){
        var body1=dbres[0].viplevelpage;
        res.render('page',{body1:body1});
    })
})

router.post('/doOrder',function(req,res){
    var order={};
    var body = new ResBody();
    order.id = req.body.id;
    order.name = req.body.name;
    order.phone = req.body.phone;
    order.address = req.body.address;
    order.pushphone = req.body.pushphone;
    order.viplevel = req.body.viplevel;
    order.vipprice = req.body.vipprice;
    User.insertOrder(order,function(err,dbres){
        if(err){
            body.code=Util.FAIL;
            return res.json(body);
        }
        order.orderid=dbres.insertId;
        body.data.push(order);
        res.json(body);
    })
})

router.post('/payOrder',function(req,res){
    var id = req.body.id;
    var channal =req.body.channal;
    console.info(JSON.stringify(req.body));
    if(channal=="alipay"){
        payOrder(req,res);
    }
})

var payOrder = function(req,res){
    var orderno = req.body.orderid;
    var clientip=req.ip;
    var price=req.body.price;
    console.log(clientip);
    pingpp.charges.create({
        subject: "netgift",
        body: "Your Body",
        amount:price*100 ,
        order_no: orderno,
        channel: "alipay",
        currency: "cny",
        client_ip: clientip,
        app: {id: "app_90ivf1PqfTaHiff1"}
    },function(err,charge){
        console.log(charge);
        return res.json(charge);
    })
}

router.post('/paysuccess',function(req,res){
    var pay={};
    var data = req.body;
    pay.data=data;
    var orderid=data.data.object.order_no;
    User.getOrderByOrderId(orderid,function(err,dbres){
        var id = dbres[0].id;
        pay.id=id;
        pay.orderid=orderid;
        User.updateVipLevel(id,dbres[0].viplevel,Util.errWarn);
        User.updateOrderPayStatus(orderid,Util.errWarn);
        User.insertPayDetail(pay,function(err,dbres){
            console.info(err);
            return res.end();
        })
    })
})

router.get('/gettestpage',function(req,res){
    var id = req.query.id;
    res.locals.id=id;
    var body=new ResBody();
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    res.render('questionpage');
})

router.get('/getTestPageData',function(req,res){
    Question.getInUseQuestion(function(err,dbres){
        res.send(dbres);
    })
})

router.post('/dotestanswer',function(req,res){
    var testanswer=req.body;
    var answers=testanswer.answers;
    var id = Number(testanswer.id);
    var testid = testanswer.testid;
    Question.insertAnswers(id,testid,answers,function(err,dbres){
        User.updateIsTestQuestion(id,Util.TEST_YES,function(err,dbres1){
            return res.end();
        })
    })
})