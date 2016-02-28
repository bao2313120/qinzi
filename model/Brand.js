var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
function Brand() {

}
module.exports = Brand;

Brand.insert = function(brand,callback){
    var sql = "insert into brand (name,branddescribe,picURL,brandlogopicURL) values (?,?,?,?)";
    db.query(sql,[brand.name,brand.branddescribe,brand.picURL,brand.brandlogopicURL],callback);
}

Brand.getAll = function(callback){
    var sql= "select *,branddescribe as 'describe' from brand where isdel=?";
    db.query(sql,Util.DEL_NO,callback);
}

Brand.getBrandById = function(brandid,callback){
    var sql="select *,branddescribe as 'describe' from brand where brandid=?";
    db.query(sql,brandid,callback);
}

Brand.editBrands = function(brands,callback){
    var sql = "update brand set name=?,branddescribe=?,picURL=?,brandlogopicURL=? where brandid=?";
    db.query(sql,[brands.name,brands.branddescribe,brands.picURL,brands.brandlogopicURL,brands.brandid],callback);
}

Brand.delBrandsByBrandsId = function(brandsid,callback){
    var sql="update brand set isdel=? where brandid=?";
    db.query(sql,[Util.DEL_YES,brandsid],callback);
}
