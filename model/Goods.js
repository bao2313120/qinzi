var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
function Goods() {

}
module.exports = Goods;
var COLUMN = "picURL,goodscategory,poster,webaddr,support,actsupport," +
    "share,dissupport,date,iscommend,brand,commenddate,widepicURL,brandid,type,name";

Goods.getMoreGoods = function(offset,pageSize,callback){
    var sql ="select * from goods where iscommend=? order by commenddate DESC limit ?,?" ;
    db.query(sql,[Util.COMMEND_YES,offset,pageSize],callback);
}


Goods.insert = function(goods,callback){
    var sql = "insert into goods("+COLUMN+") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[goods.picURL,goods.goodscategory,goods.poster,goods.webaddr,
        goods.support,goods.actsupport,goods.share,goods.dissupport,goods.date,
        goods.iscommend,goods.brand,goods.commenddate,goods.widepicURL,
        goods.brandid,goods.type,goods.name],callback);
}

Goods.update  = function(goods,callback){
    var sql = "update goods set picURL=?,goodscategory=?,poster=?,webaddr=?,support=?, " +
        " iscommend=?,brand=?,commenddate=?,widepicURL=?,brandid=?,type=?,name=? where goodsid=?";
    db.query(sql,[goods.picURL,goods.goodscategory,goods.poster,goods.webaddr,
        goods.support, goods.iscommend,goods.brand,goods.commenddate,
        goods.widepicURL,goods.brandid,goods.type,goods.name,goods.goodsid],callback);
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
    var sql="select a.*,b.name as brand from goods a,brand b where a.brandid=b.brandid and a.brandid=? limit ?,? ";
    db.query(sql,[brandId,offset,pagesize],callback);
}

Goods.getGoodsByCateGoryId  = function(categoryid,offset,pagesize,callback){
    var sql ="select * from goods where goodscategory=? limit ?,?";
    db.query(sql,[categoryid,offset,pagesize],callback);
}

Goods.getAllGoods = function(callback){
    var sql = "select goodsid,name,iscommend from goods";
    db.query(sql,callback);
}

Goods.getGoodsByGoodsId = function(goodsid,callback){
    var sql = "select * from goods where goodsid=?";
    db.query(sql,goodsid,callback);
}

Goods.addGoodsPage = function(goodsid,goodspage,callabck){
    var sql = "insert into goodspage (goodsid,goodspage) values(?,?)";
    db.query(sql,[goodsid,goodspage],callabck);
}

Goods.updateGoodsPage = function(goodsid,goodspage,callback){
    var sql = "update goodspage set goodspage=? where goodsid=?";
    db.query(sql,[goodspage,goodsid],callback);
}
Goods.getGoodsPageById = function(goodsid,callback){
    var sql="select * from goodspage where goodsid=?";
    db.query(sql,goodsid,callback);
}

Goods.updateCommendYes = function(goodsid,commenddate,callback){
    var sql = "update goods set iscommend=?,commenddate=? where goodsid=?";
    db.query(sql,[Util.COMMEND_YES,commenddate,goodsid],callback);
}

Goods.updateCommendNo = function(goodsid,callback){
    var sql="update goods set iscommend=? where goodsid=?";
    db.query(sql,[Util.COMMEND_NO,goodsid],callback);
}