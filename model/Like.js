var db=require('../db');
var Util=require('../util');
function Like() {

}
module.exports = Like;

Like.insertGoods= function(id,goodsid,type,islike,callback){
    var sql = "insert into like (id,goodsid,type,islike) values (?,?,?,?)";
    db.query(sql,[id,goodsid,type,islike],callback);
}

Like.insertActionPic= function(id,actionid,actionpicid,type,islike,callback){
    var sql = "insert into like (id,actionid,actionpicid,type,islike) values (?,?,?,?,?)";
    db.query(sql,[id,actionid,actionpicid,type,islike],callback);
}

Like.getAllGoodsLikeByIdAndIsLike = function(id,islike,callback){
    var sql = "select * from like where id=? and type=? and islike=?";
    db.query(sql,[id,Util.SUPPORT_TYPE_GOODS,islike],callback);
}

Like.getAllGoodsLikeById = function(id,callback){
    var sql = "select * from like where type=? and id=?";
    db.query(sql,[Util.SUPPORT_TYPE_GOODS,id],callback);
}

