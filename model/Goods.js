var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
function Goods() {

}
module.exports = Goods;
var COLUMN = "id,picURL,goods_category,poster,webaddr,support,actsupport," +
    "share,dissupport,date,iscommend,brandid,commenddate";

Goods.getMoreGoods = function(offset,pageSize,callback){
    var sql ="select * from goods where iscommend=? order by commenddate DESC limit ?,?" ;
    db.query(sql,[Util.COMMEND_YES,offset,pageSize],callback);
}


Goods.insert = function(goods,callback){
    var sql = "insert into goods("+COLUMN+") values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[goods.id,goods.picURL,goods.goods_category,goods.poster,goods.webaddr,
        goods.support,goods.actsupport,goods.share,goods.dissupport,goods.date,
        goods.iscommend,goods.brandid,goods.commenddate],callback);
}

Goods.addUserDisSupport = function(id,goodsid,callback){
    var sql ="update goods set dissupport=dissupport+1 where goodsid=?";
    db.query(sql,goodsid,function(err,dbres){
        Like.insertGoods(id,goodsid,Util.SUPPORT_TYPE_GOODS,Util.LIKE_NO,callback);
    });
}

Goods.addUserActSupport = function(id,goodsid,callback){
    var sql ="update goods set actsupport=actsupport+1 where goodsid=?";
    db.query(sql,goodsid,function(err,dbres){
        Like.insertGoods(id,goodsid,Util.SUPPORT_TYPE_GOODS,Util.LIKE_YES,callback);
    });
}

Goods.getMoreGoodsByBrand = function(offset,pagesize,brandId,callback){
    var sql="select * from goods where brandid=? limit ?,? ";
    db.query(sql,[brandId,offset,pagesize],callback);
}


