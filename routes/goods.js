var express = require('express');
var router = express.Router();
var db = require('../db');
var Util = require('../util');
var Goods = require('../model/Goods');
var ResBody=require('../model/ResBody');
var Like = require('../model/Like');
var GoodsCateGory=require('../model/GoodsCateGory');
var Brand = require('../model/Brand');
var MemberAction = require('../model/MemberAction');
var config = require('../config/default');
module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!!!');
});
//获取推荐页
router.get('/getrecomment',function(req,res){
    var body=new ResBody();
    var id=req.query.id;

    var offset=req.query.offset;
    var pagesize = req.query.pagesize;
    if(offset==null||offset==""||pagesize==null||pagesize==""){
        body.code=Util.ERR_ARGS;
        body.failure=Util.ERR_ARGS_FAILURE;
        return res.json(body);
    }
    offset=parseInt(offset);
    pagesize=parseInt(pagesize);
    Goods.getMoreGoods(offset,pagesize,function(err,dbres){
        if(err){
            console.error(err);
            body.code=Util.FAIL;
            return res.json(body);
        }
        MemberAction.getMainPage(function(err,dbMainPages){
            if(err){
                console.error(err);
                body.failure=Util.FAIL;
                return res.json(body);
            }
            var data={};
            data.actionmainpage=dbMainPages[0];
            if(id!=null||id!=""&&dbres!=null&&dbres.length>0){
                Like.getAllGoodsLikeById(id,function(err,dbres1){
                    if(dbres1!=null&&dbres1.length>0){
                        for(var i in dbres){
                            for(var j in dbres1){
                                if(dbres[i].goodsid==dbres1[j].goodsid){
                                    dbres[i].issupport=dbres1[j].islike;
                                }else{
                                    dbres[i].issupport =Util.LIKE_NULL;
                                }
                            }
                        }
                        data.recommentlist=dbres;
                        body.data.push(data);
                        return res.json(body);
                    }else{
                        data.recommentlist=dbres;
                        body.data.push(data);
                        return res.json(body);
                    }
                })
            }else{
                data.recommentlist=dbres;
                body.data.push(data);
                return res.json(body);
            }
        })
    })
});
//获取商品页主页
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

router.get('/brands',function(req,res){
    var body=new ResBody();
    Brand.getAll(function(err,dbres){
        for(var i in dbres){
            body.data.push(dbres[i]);
        }
        res.json(body);
    })
});
//需要修改，品牌数据不全
router.get('/getGoodsByBrand',function(req,res){
    var body = new ResBody();
    var brandId=req.query.brandid;
    var offset=req.query.offset;
    var pagsize=req.query.pagesize;
    if(offset==null||offset==""||pagesize==null||pagesize==""){
        body.code=Util.ERR_ARGS;
        body.failure=Util.ERR_ARGS_FAILURE;
        return res.json(body);
    }
    offset=parseInt(offset);
    pagesize=parseInt(pagesize);

    if(brandId==null||brandId==""){
        body.code=Util.ERR_ARGS;
        body.failure=Util.ERR_ARGS_FAILURE;
        return res.json(body);
    }
    var data={};
    Brand.getBrandById(brandId,function(err,title){
        data.title=title;
        Goods.getMoreGoodsByBrand(offset,pagsize,brandId,function(err,dbres){
            data.brandlist=dbres;
            body.data.push(data);
            return res.json(body);
        })
    })
});


