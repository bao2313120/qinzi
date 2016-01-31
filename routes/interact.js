var express = require('express');
var router = express.Router();
var db = require('../db');
var Util = require('../util');
var Goods = require('../model/Goods');
var MemberAction = require('../model/MemberAction');
var ResBody=require('../model/ResBody');
var Contribute = require('../model/Contribute');
var Like = require('../model/Like');
var moment = require('moment');
var formidable = require('formidable');
var fs = require('fs');
var async = require('async');
var config  = require('config');
module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource!!!');
});

router.post('/support',function(req,res){
    var body=new ResBody();
    var id=req.body.id;
    var goodsid=Number(req.body.goodsid);
    var supporttype=req.body.supporttype;
    var isLike=req.body.islike;
    var actionid=Number(req.body.actionid);
    var actionpicid=Number(req.body.actionpicid);
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    if(supporttype==Util.SUPPORT_TYPE_GOODS){
        Like.getGoodsLikeByGoodsId(id,goodsid,function(err,dbres){
            if(dbres!=null&&dbres.length>0){
                return res.json(body);
            }
            supportGoods(goodsid,id,isLike,function(err1,dbres1){
                return res.json(body);
            });
        })

    }else if(supporttype==Util.SUPPORT_TYPE_ACTION){
        Like.getAllActionLikeByIdAndActionId(id,actionid,function(err,dbres){
            if(dbres!=null&&dbres.length>0){
                return res.json(body);
            }
            supportAction(actionid,actionpicid,id,isLike,function(err1,dbres1){
                return res.json(body);
            })
        })

    }
});

function supportGoods(goodsid,id,isLike,callback){
    if(isLike==Util.LIKE_YES){
        Goods.addUserActSupport(id,goodsid,callback)
    }else if(isLike==Util.LIKE_NO){
        Goods.addUserDisSupport(id,goodsid,callback);
    }
}

function supportAction(actionid,actionpicid,id,islike,callback){
    if(islike==Util.LIKE_YES){
        MemberAction.addUserActSupport(id,actionid,actionpicid,callback);
    }else if(islike==Util.LIKE_NO){
        MemberAction.addUserDisSupport(id,actionid,actionpicid,callback);
    }
}
//
router.post('/contribute',function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = config.updatetmppath;
    var id=req.header('id');
    var message = req.header('message');
    console.log(JSON.stringify(req.body));
    form.parse(req,function(err,fields,files){
        var body=new ResBody();
        console.log(1+""+JSON.stringify(fields));
        console.log(2+""+JSON.stringify(files));
        console.info(files.length);
        var time = new moment().format("YYYY-MM-DD");
        if(id==null||id==""){
            body.code=Util.ERR_LOGIN_NO;
            body.failure=Util.ERR_LOGIN_NO_FAILURE;
            return res.json(body);
        }
        var contribute ={};
        contribute.id=id;
        contribute.time=time;
        contribute.message=message;
        Contribute.insert(contribute,function(err,dbres){
            contribute.contributeid=dbres.insertId;
            saveImage(files,contribute,body,res);
        })
    })

    form.on('end',function(){
        console.info("over")
    })
})

function saveImage(files,contribute,body,res){
    async.eachSeries(files,function(file,cb){
        console.info(file);
        var fileName = Util.getFileName(file);
        console.info(fileName);
        var updateDir = config.updatepath+fileName;
        fs.rename(file.path,updateDir,function(err){
            console.log(err);
            var contributePic={};
            contributePic.contributepicname=fileName;
            contributePic.contributeid=contribute.contributeid;
            Contribute.insertPic(contributePic,function(err,dbres){
                cb(null,null);
            })
        });
    },function(err){
        res.json(body);
    })

}