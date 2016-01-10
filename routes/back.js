var express = require('express');
var router = express.Router();
var Util = require('../util');
var Brand = require('../model/Brand');
var GoodsCateGory = require('../model/GoodsCateGory');
var Goods = require('../model/Goods');
var User = require('../model/User');
var Question = require('../model/Question');
var moment = require('moment');

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
    res.locals.goodsid=goodsid;
    res.render('editgoods',{goodsid:goodsid});
})

router.get('/getgoodsinfo',function(req,res){
    var goodsid=req.query.goodsid;
    Goods.getGoodsByGoodsId(goodsid,function(err,dbres){
        Goods.getGoodsPageById(goodsid,function(err,dbres1){
            dbres[0].goodspage=dbres1[0].goodspage;
            res.send(dbres[0]);
        })

    })
})

router.post('/addgoods',function(req,res){
    var goods = req.body;
    goods.commenddate=new moment(goods.commenddate).format('YYYY-MM-DD');
    goods.commenddate=new moment(goods.commenddate).format('YYYY-MM-DD');
    var brandoptions=goods.brandoptions;
    for(var i in brandoptions){
        if(brandoptions[i].brandid==goods.brandid){
            goods.brand=brandoptions[i].name;
            break;
        }
    }
    Goods.insert(goods,function(err,dbres){
        Goods.addGoodsPage(dbres.insertId,goods.goodspage,function(err,dbres1){
            res.end();
        })
    })
})

router.post('/updategoodsinfo',function(req,res){
    var goods=req.body;
    goods.commenddate=new moment(goods.commenddate).format('YYYY-MM-DD');
    var goodsid=goods.goodsid;
    var goodspage = goods.goodspage;
    console.info(req.body);
    Goods.update(goods,function(err,dbres){
        Goods.updateGoodsPage(goodsid,goodspage,function(err,dbres1){
            res.end();
        })
    })
})
//推荐某商品
router.get('/commendonegoods',function(req,res){
    var goodsid=req.query.goodsid;
    var commenddate= new moment().format('YYYY-MM-DD');
    Goods.updateCommendYes(goodsid,commenddate,function(err,dbres){
        res.end();
    })
})
//取消推荐
router.get('/discommendonegoods',function(req,res){
    var goodsid=req.query.goodsid;
    Goods.updateCommendNo(goodsid,function(err,dbres){
        res.end();
    })
})

router.get('/alluserpage',function(req,res){
    res.render('usermanager');
})
router.get('/getallusers',function(req,res){
    User.queryAll(function(err,dbres){
        for(var i in dbres){
            dbres[i].index=Number(i)+1;
        }
        res.send(dbres);
    })
})

router.get('/allquestionpage',function(req,res){
    res.render('questionmanager');
})

router.get('/getalltest',function(req,res){
    Question.getAllTest(function(err,dbres){
        res.send(dbres);
    })
})

router.get('/toeditquestion',function(req,res){
    var testid=req.query.testid;
    res.render('editquestion',{testid:testid});
})

router.get('/getAllQuestionByTestId',function(req,res){
    var testid= req.query.testid;
    Question.getAllQuestionByTestId(testid,function(err,dbres){
        for(var i in dbres){
            dbres[i].index=Number(i)+1;
        }
        res.send(dbres);
    })
})

router.post('/addquestion',function(req,res){
    var question = req.body;
    Question.insertQuestion(question,function(err,dbres){
        res.send(dbres);
    })
})


router.post('/delquestion',function(req,res){
    var questionid = req.body.questionid;
    Question.delQuestion(questionid,function(err,ebres){
        res.end();
    })
})

router.post('/useTestPage',function(req,res){
    var testid = req.body.testid;
    Question.useTest(testid,function(err,dbres){
        Question.disUseOtherTest(testid,function(err1,dbres1){
            Question.getAllTest(function(err,dbres){
                res.send(dbres);
            })
        })
    })
})

router.get('/gettestpage',function(req,res){
    res.render('questionpage');
})

router.get('/getTestPageData',function(req,res){
    Question.getInUseQuestion(function(err,dbres){
        res.send(dbres);
    })
})



module.exports = router;