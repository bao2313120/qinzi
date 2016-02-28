var express = require('express');
var router = express.Router();
var Util = require('../util');
var Brand = require('../model/Brand');
var GoodsCateGory = require('../model/GoodsCateGory');
var Goods = require('../model/Goods');
var User = require('../model/User');
var Question = require('../model/Question');
var ResBody = require('../model/ResBody');
var MemberAction = require('../model/MemberAction');
var moment = require('moment');
var async = require('async');
var config = require('config');

/* GET home page. */

//登录拦截器
router.use(function (req, res, next) {
    var url = req.originalUrl;
    if (url!="/back/gettestpage"&&!req.session.info) {
        return res.render("login");
    }
    next();
});

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
    var goodsid=Number(req.query.goodsid);
    Goods.getGoodsByGoodsId(goodsid,function(err,dbres){
        Goods.getGoodsPageById(goodsid,function(err,dbres1){
            if(dbres1==null||dbres1.length==0){
                res.end();
            }
            dbres[0].goodspage=dbres1[0].goodspage;
            res.send(dbres[0]);
        })
    })
})

router.post('/addgoods',function(req,res){
    var goods = req.body;
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

router.post('/addtest',function(req,res){
    var testname=req.body.testname;
    Question.insertTest(testname,function(err,dbres){
        Question.getAllTest(function(err,dbres1){
            res.send(dbres1);
        })
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

router.get('/getactions',function(req,res){
    var id = req.query.id;
    MemberAction.getAllActions(function(err,dbres){
        for(var i in dbres){
            dbres[i].index=Number(i)+1;
        }
        res.json(dbres);
    })
})

router.get('/getallactions',function(req,res){
    res.render('membermanager');
})

router.get('/toeditaction',function(req,res){
    var actionid = req.query.actionid;
    res.locals.actionid=actionid;
    res.render('editmember');
})

router.post('/addaction',function(req,res){
    var action = req.body;
    action.time = new moment().format('YYYY-MM-DD');
    MemberAction.insert(action,function(err,dbres){
        MemberAction.getAllActions(function(err,dbres1){
            for(var i in dbres1){
                dbres1[i].index=Number(i)+1;
            }
            res.json(dbres1);
        })
    })
})

router.post('/nodisplayaction',function(req,res){
    var actionid=req.body.actionid;
    MemberAction.nodisplayAction(actionid,function(err,dbres){
        MemberAction.getAllActions(function(err,dbres1){
            for(var i in dbres1){
                dbres1[i].index = Number(i)+1;
            }
            res.json(dbres1);
        })
    })
})

router.post('/displayaction',function(req,res){
    var actionid=req.body.actionid;
    MemberAction.displayAction(actionid,function(err,dbres){
        MemberAction.getAllActions(function(err,dbres1){
            for(var i in dbres1){
                dbres1[i].index = Number(i)+1;
            }
            res.json(dbres1);
        })
    })
})

router.post('/addactionpic',function(req,res){
    var pics = req.body.pics;
    console.info(pics);
    var actionid=req.body.actionid;
    console.log("action:"+actionid);
    async.eachSeries(pics,function(pic,cb){
        MemberAction.getActionPicBypicURL(pic.picURL, function (err,results) {
            if(results==null||results.length==0){
                console.log(pic.picURL+"不存在");
                MemberAction.getMaxpicNumByActionId(actionid,function(err,dbres1){
                    pic.actionpicnum=(dbres1[0].actionpicnum==null?1:dbres1[0].actionpicnum);
                    MemberAction.insertMemberActionPics(pic,cb);
                })

            }else{
                cb(null,null);
            }
        })
    },function(err){
        MemberAction.getActionPicsById(actionid,function(err,dbres1){
            console.log("to:"+err+ JSON.stringify(dbres1));
            res.json(dbres1);
        })
    })
})

router.post('/delactionpic',function(req,res){
    var actionpicid = req.body.actionpicid;
    var actionid=req.body.actionid;
    MemberAction.delImageByActionPicId(actionpicid,function(err,dbres){
        MemberAction.getActionPicsById(actionid,function(err,dbres1){
            console.log("to:"+err+ JSON.stringify(dbres1));
            res.json(dbres1);
        })
    })
})

router.get('/getactionpics',function(req,res){
    var actionid= req.query.actionid;
    MemberAction.getActionPicsById(actionid, function (err,dbres) {
        res.json(dbres);
    })
})

router.get('/getallbrands',function(req,res){
    Brand.getAll(function (err,dbres) {
        for(var i in dbres){
            dbres[i].index=Number(i)+1;
        }
        res.json(dbres);
    })
})

router.get('/brandsmanager',function(req,res){
    res.render('brandsmanager');
})


router.post('/addbrands',function(req,res){
    var brands = req.body;
    brands.picURL=brands.picURL==null?"":brands.picURL.match(new RegExp(config.imageRegex));
    brands.brandlogopicURL = brands.brandlogopicURL==null?"":brands.brandlogopicURL.match(new RegExp(config.imageRegex));
    Brand.insert(brands,function(err,dbres){
        Brand.getAll(function(err,dbres1){
            for(var i in dbres1){
                dbres1[i].index=Number(i)+1;
            }
            res.json(dbres1);
        })
    })
})

router.post('/editbrands',function(req,res){
    var brands=req.body;
    brands.picURL=brands.picURL==null?"":brands.picURL.match(new RegExp(config.imageRegex));
    brands.brandlogopicURL = brands.brandlogopicURL==null?"":brands.brandlogopicURL.match(new RegExp(config.imageRegex));
    Brand.editBrands(brands,function(err,dbres){
        Util.errWarn(err);
        Brand.getAll(function(err,dbres1){
            for(var i in dbres1){
                dbres1[i].index=Number(i)+1;
            }
            res.json(dbres1);
        })
    })
})

module.exports = router;