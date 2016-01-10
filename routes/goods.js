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
var moment = require('moment');
var async = require('async');
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
                        var timeRes=setrecommentListTime(dbres);
                        data.recommentlist=timeRes;
                        body.data.push(data);
                        return res.json(body);
                    }else{
                        var timeRes=setrecommentListTime(dbres);
                        data.recommentlist=timeRes;
                        body.data.push(data);
                        return res.json(body);
                    }
                })
            }else{
                var timeRes=setrecommentListTime(dbres);
                data.recommentlist=timeRes;
                body.data.push(data);
                return res.json(body);
            }
        })
    })
});

function setrecommentListTime(dbres){
    var timeres={};
    for(var i in dbres){
        var goods=dbres[i];
        var recommenddate=goods.commenddate;
        var date= new moment(recommenddate).format('MMM.DD');
        var thistime=timeres[date];
        if(thistime==null||thistime==""){
            timeres[date]=thistime=[];
            thistime.push(goods);
        }else{
            thistime.push(goods);
        }
    }
    var returnTimeRes=[];
    for(var i in timeres){
        var timeRes={};
        timeRes.time=i;
        timeRes.timeList=timeres[i];
        returnTimeRes.push(timeRes);
    }
    return returnTimeRes;
}


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


router.get('/getgoodsbycategory',function(req,res){
    var body=new ResBody();
    var categoryid=Number(req.query.categoryid);
    var offset = Number(req.query.offset);
    var pagesize = Number(req.query.pagesize);
    var id = req.query.id;
    var data={};
    Goods.getGoodsByCateGoryId(categoryid,offset,pagesize,function(err,dbres){
        Like.setIsLike(id,dbres,function(err,goods){
            GoodsCateGory.getCateGoryById(categoryid,function(err,category){
                data.title=category;
                data.goods=goods;
                body.data.push(data);
                return res.json(body);
            })
        })
    })
})
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
    var brandId=Number(req.query.brandid);
    var offset=Number(req.query.offset);
    var pagesize=Number(req.query.pagesize);
    var id=req.query.id;
    if(offset===null||offset===""||pagesize===null||pagesize===""){
        body.code=Util.ERR_ARGS;
        body.failure=Util.ERR_ARGS_FAILURE;
        return res.json(body);
    }
    offset=parseInt(offset);
    pagesize=parseInt(pagesize);
    if(brandId===null||brandId===""){
        body.code=Util.ERR_ARGS;
        body.failure=Util.ERR_ARGS_FAILURE;
        return res.json(body);
    }
    var data={};
    Brand.getBrandById(brandId,function(err,title){
        data.title=title;
        Goods.getMoreGoodsByBrand(offset,pagesize,brandId,function(err,dbres){
            Like.setIsLike(id,dbres,function(err,goods){
                data.goods=goods;
                body.data.push(data);
                return res.json(body);
            })
        })
    })
});

router.get('/search',function(req,res){
    var body = new ResBody();
    var id = req.query.id;
    var search = req.query.search;
    var offset = Number(req.query.offset);
    var pagesize = Number(req.query.pagesize);
    var searchresult=[];
    var data={};
    var search1="%"+search+"%";
    Goods.search(search1,function(err,dbres){
        searchresult=searchresult.concat(dbres);
        var searchs = Util.splitStrNoRepeat(search)
        async.eachSeries(searchs,function(searchword,cb){
            Goods.search(searchword,function(err,results){
                searchresult=searchresult.concat(results);
                cb(null,results);
            })
        },function(err){
            searchresult = Util.setNoRepeat(searchresult);
            Like.setIsLike(id,searchresult,function(err,searchresults){
                data.searchresult=searchresults;
                body.data.push(data);
                res.json(body);
            })

        })
    })
})

router.post('/returngoods',function(req,res){
    var body=new ResBody();
    var id=req.body.id;
    var message = req.body.message;
    var time = new moment().format("YYYY-MM-DD");
    if(id==null||id==""){
        body.code=Util.ERR_LOGIN_NO;
        body.failure=Util.ERR_LOGIN_NO_FAILURE;
        return res.json(body);
    }
    var returngoods={};
    returngoods.id=id;
    returngoods.message=message;
    returngoods.time=time;
    Goods.insertReturnGoods(returngoods,function(err,dbres){
        return res.json(body);
    })
})


