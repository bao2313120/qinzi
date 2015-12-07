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

router.get('/getactions',function(req,res){
    var offset = req.query.offset;
    var pagesize = req.query.pagesize;
    var body=new ResBody();
    MemberAction.getActions(offset,pagesize,function(err,dbres){
        body.data=dbres;
        res.json(body);
    })
});

router.get('/getactionpics',function(req,res){
    var offset = req.query.offset;
    var pagesize = req.query.pagesize;
    var actionid = req.query.actionid;
    var body=new ResBody();
    var data={}
    MemberAction.getActionById(actionid,function(err,titleRes){
        data.title=titleRes;
        MemberAction.getActionPicsById(actionid,function(err,dbRes){
            data.actionpics=dbRes;
            body.data.push(data);
            res.json(body);
        })
    })
})