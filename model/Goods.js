var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
function Goods() {

}
module.exports = Goods;
var COLUMN = "id,picid,goodtype,poster,webaddr,support,actsupport," +
    "share,dissupport,date,iscommend,brandid,commenddate";

Goods.getAllGoods = function(callback){
    var sql ="select * from goods where iscommend=? order by commenddate DESC";
    db.query(sql,Util.COMMEND_YES,callback);
}

Goods.insert = function(goods,callback){
    var sql = "insert into goods("+COLUMN+") values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[goods.id,goods.picid,goods.goodtype,goods.poster,goods.webaddr,
        goods.support,goods.actsupport,goods.share,goods.dissupport,goods.date,
        goods.iscommend,goods.brandid,goods.commenddate],callback);
}

Goods.addUserDisSupport = function(id,goodsid,callback){
    var sql ="update goods set dissupport=dissupport+1 where goodsid=?";
    db.query(sql,goodsid,function(err,dbres){
        Like.insert(id,goodsid,Util.LIKE_NO,callback);
    });
}

Goods.addUserActSupport = function(id,goodsid,callback){
    var sql ="update goods set support=support+1 where goodsid=?";
    db.query(sql,goodsid,function(err,dbres){
        Like.insert(id,goodsid,Util.LIKE_YES,callback);
    });
}

Goods.getAllGoodsByBrand = function(brandId,callback){
    var sql="select * from goods where brandid=?";
    db.query(sql,brandId,callback);
}


