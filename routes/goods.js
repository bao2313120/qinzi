var express = require('express');
var router = express.Router();
var db = require('../db');
var Util = require('../util');
var Goods = require('../model/Goods');
var ResBody=require('../model/ResBody');
var Like = require('../model/Like');
var GoodsCateGory=require('../model/GoodsCateGory');
var Brand = require('../model/Brand');
module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!!!');
});

router.get('/getrecomment',function(req,res){
    var body=new ResBody();
    var id=req.query.id;
    Goods.getAllGoods(function(err,dbres){
        if(err){
            console.error(err);
            body.failure=Util.FAIL;
            return res.json(body);
        }
        if(id!=null||id!=""&&dbres!=null&&dbres.length>0){
            Like.getAllLikeById(id,function(err,dbres1){
                if(dbres1!=null&&dbres1.length>0){
                    for(var i in dbres){
                        for(var j in dbres1){
                            if(dbres[i].goodsid==dbres1[j].goodsid){
                                dbres[i].issupport=dbres1[j].type;
                            }
                        }
                    }
                    body.data=dbres;
                    return res.json(body);
                }else{
                        body.data=dbres;
                        return res.json(body);
                    }
            })
        }else{
            body.data=dbres;
            return res.json(body);
        }
    })
});

router.get('/goodsindex',function(req,res){
    var body=new ResBody();
    GoodsCateGory.getGoodsCateGoryByType(Util.CATEGORY_ONE,function(err,dbres){
        GoodsCateGory.getGoodsCateGoryByType(Util.CATEGORY_TWO,function(err,dbres1){
            var cateGoryRes={};
            cateGoryRes.categoryone=dbres;
            cateGoryRes.categorytwo=dbres1;
            body.data.push(cateGoryRes);
            res.json(body);
        });
    });
});

router.get('./brands',function(req,res){
    var body=new ResBody();
    Brand.getAll(function(err,dbres){
        for(var i in dbres){
            body.data.push(dbres[i]);
        }
        res.json(body);
    })
});

router.get('/getGoodsByBrand',function(req,res){
    var body = new ResBody();
    var brandId=req.query.brandid;
    if(brandId==null||brandId==""){
        body.code=Util.ERR_ARGS;
        body.failure=Util.ERR_ARGS_FAILURE;
        return res.json(body);
    }
    Goods.getAllGoodsByBrand(brandId,function(err,dbres){
        for(var i in dbres){
            body.data.push(dbres[i]);
        }
        return res.json(body);
    })
});


