var express = require('express');
var router = express.Router();
var Util = require('../util');
var Brand = require('../model/Brand');
var GoodsCateGory = require('../model/GoodsCateGory');
var Goods = require('../model/Goods');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pagegen',function(req,res){
    res.render('pagegen');
})

router.get('/addgoods',function(req,res){
    res.render('addgoods');
})
router.get('/getAddGoodsInfo',function(req,res){
    var data={};
    GoodsCateGory.getGoodsCateGoryByType(Util.CATEGORY_ONE,function(err,CateGoryOne){
        data.categoryoptions=CateGoryOne;
        GoodsCateGory.getGoodsCateGoryByType(Util.CATEGORY_TWO,function(err,CateGoryTwo){
            data.typeoptions=CateGoryTwo;
            Brand.getAll(function(err,brands){
                data.brandoptions = brands;
                res.send(data);
            })
        })
    })
})


router.get('/allgoodspage',function(req,res){
    res.render('goodsmanager');
})
router.get('/getallgoods',function(req,res){
    Goods.getAllGoods(function(err,dbres){
        for(var i in dbres){
            dbres[i].index=Number(i)+1;
        }
        res.send(dbres);
    })
})

router.get('/toeditgoods',function(req,res){
    var goodsid=req.query.goodsid;
    Goods.getGoodsByGoodsId(goodsid,function(err,dbres){
        res.locals.data=dbres;
        res.render('editgoods');

    })
})
module.exports = router;
