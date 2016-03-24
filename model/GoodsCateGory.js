var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
var config=require('config');
function GoodsCateGory() {

}
module.exports = GoodsCateGory;

GoodsCateGory.getGoodsCateGoryByType=function(categorytype,callback){
    var sql="select *,categorydescribe as 'describe' from goods_category where categorytype=? and isdel=?";
    db.query(sql,[categorytype,Util.DEL_NO],callback);
}

GoodsCateGory.insert=function(goodsCateGory,callback){
    var sql="insert into goods_category (categoryname,location,categorydescribe,categorytype,picURL,widepicURL)" +
        " values(?,?,?,?,?,?)";
    goodsCateGory.picURL=goodsCateGory.picURL==null?"":goodsCateGory.picURL.match(config.imageRegex);
    goodsCateGory.widepicURL=goodsCateGory.widepicURL==null?"":goodsCateGory.widepicURL.match(config.imageRegex);
    db.query(sql,[goodsCateGory.categoryname,goodsCateGory.location, goodsCateGory.categorydescribe,
        goodsCateGory.categorytype,goodsCateGory.picURL,goodsCateGory.widepicURL],callback);
}

GoodsCateGory.getCateGoryById = function(cateGoryId,callback){
    var sql = "select *,categorydescribe as 'describe' from goods_category where categoryid=?";
    db.query(sql,[cateGoryId],callback);
}

GoodsCateGory.getAllCateGory = function(callback){
    var sql="select *,categorydescribe as 'describe' from goods_category where isdel=?";
    db.query(sql,Util.DEL_NO,callback);
}


GoodsCateGory.update = function(category,callback){
    var sql="update goods_category set categoryname=?,location=?,categorydescribe=?,categorytype=?,picURL=?,widepicURL=? where categoryid=?";
    category.picURL=category.picURL==null?"":category.picURL.match(config.imageRegex);
    category.widepicURL=category.widepicURL==null?"":category.widepicURL.match(config.imageRegex);
    db.query(sql,[category.categoryname,category.location,category.categorydescribe,category.categorytype,category.picURL,category.widepicURL,category.categoryid],callback);
}

GoodsCateGory.delcategory = function(categoryid,callback){
    var sql ="update goods_category set isdel=? where categoryid=?";
    db.query(sql,[Util.DEL_YES,categoryid],callback);
}