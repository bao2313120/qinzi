var express = require('express');
var router = express.Router();
var db = require('../db');
var Util = require('../util');
var Goods = require('../model/Goods');
var ResBody=require('../model/ResBody');
module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource!!!');
});

router.post('/support',function(req,res){
    var body=new ResBody();
    var id=req.body.id;
    var goodsid=req.body.id;
    var isLike=req.body.islike;
    if(isLike==Util.LIKE_YES){
        Goods.addUserActSupport(id,goodsid,function(err,dbres){
            return res.json(body);
        })
    }else if(isLike==Util.LIKE_NO){
        Goods.addUserDisSupport(id,goodsid,function(err,dbres){
            return res.json(body);
        });
    }

});