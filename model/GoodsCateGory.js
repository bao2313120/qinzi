var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
function GoodsCateGory() {

}
module.exports = GoodsCateGory;

GoodsCateGory.getGoodsCateGoryByType=function(categorytype,callback){
    var sql="select *,categorydescribe as 'describe' from goods_category where categorytype=?";
    db.query(sql,categorytype,callback);
}

GoodsCateGory.insert=function(goodsCateGory,callback){
    var sql="insert into goods_category (categoryname,location,categorydescribe,categorytype)" +
        " values(?,?,?,?)";
    db.query(sql,[goodsCateGory.categoryname,goodsCateGory.location, goodsCateGory.categorydescribe,
        goodsCateGory.categorytype],callback);
}

GoodsCateGory.getCateGoryById = function(cateGoryId,callback){
    var sql = "select *,categorydescribe as 'describe' from goods_category where categoryid=?";
    db.query(sql,[cateGoryId],callback);
}

