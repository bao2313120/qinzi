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
    var sql= "select *,branddescribe as 'describe' from brand";
    db.query(sql,callback);
}

Brand.getBrandById = function(brandid,callback){
    var sql="select *,branddescribe as 'describe' from brand where brandid=?";
    db.query(sql,brandid,callback);
}

