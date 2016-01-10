var db=require('../db');
var Util=require('../util');
function Like() {

}
module.exports = Like;

Like.insertGoods= function(id,goodsid,type,islike,callback){
    var sql = "insert into userlike (id,goodsid,type,islike) values (?,?,?,?)";
    db.query(sql,[id,goodsid,type,islike],callback);
}

Like.insertActionPic= function(id,actionid,actionpicid,type,islike,callback){
    var sql = "insert into userlike (id,actionid,actionpicid,type,islike) values (?,?,?,?,?)";
    db.query(sql,[id,actionid,actionpicid,type,islike],callback);
}

Like.getAllGoodsLikeByIdAndIsLike = function(id,islike,callback){
    var sql = "select * from userlike where id=? and type=? and islike=?";
    db.query(sql,[id,Util.SUPPORT_TYPE_GOODS,islike],callback);
}

Like.getAllGoodsLikeById = function(id,callback){
    var sql = "select * from userlike where type=? and id=?";
    db.query(sql,[Util.SUPPORT_TYPE_GOODS,id],callback);
}

Like.getAllActionLikeByIdAndActionId = function(id,actionid,callback){
    var sql = "select * from userlike where type=? and id=? and actionid=?";
    db.query(sql,[Util.SUPPORT_TYPE_ACTION,id,actionid],callback);
}

Like.setIsLike = function(id,goodsList,callback){
    if(id!=null&&id!=""&&goodsList!=null&&goodsList.length>0){
        Like.getAllGoodsLikeById(id,function(err,dbres1){
            if(dbres1!=null&&dbres1.length>0){
                for(var i in goodsList){
                    for(var j in dbres1){
                        if(goodsList[i].goodsid==dbres1[j].goodsid){
                            goodsList[i].issupport=dbres1[j].islike;
                            break;
                        }else{
                            goodsList[i].issupport =Util.LIKE_NULL;
                        }
                    }
                }
            }else{
                for(var i in goodsList){
                    goodsList[i].issupport=Util.LIKE_NULL;
                }
            }
            return callback(null,goodsList);
        })
    }else{
        for(var i in goodsList){
            var goods = goodsList[i];
            goods.issupport=Util.LIKE_NULL;
        }
        return callback(null,goodsList);
    }
}


Like.setIsActionPicLike = function(id,actionid,actionpics,callback){
    if(id!=null&&id!=""&&actionpics!=null&&actionpics.length>0){
        Like.getAllActionLikeByIdAndActionId(id,actionid,function(err,dbres1){
            if(dbres1!=null&&dbres1.length>0){
                for(var i in actionpics){
                    for(var j in dbres1){
                        if(actionpics[i].actionpicid==dbres1[j].actionpicid){
                            actionpics[i].issupport=dbres1[j].islike;
                            break;
                        }else{
                            actionpics[i].issupport =Util.LIKE_NULL;
                        }
                    }
                }
            }else{
                for(var i in actionpics){
                    actionpics[i].issupport=Util.LIKE_NULL;
                }
            }
            return callback(null,actionpics);
        })
    }else{
        return callback(null,actionpics);
    }
}
