var db=require('../db');
var Util=require('../util');
var Like=require('./Like');
function Brand() {

}
module.exports = Brand;

Brand.insert = function(brand,callback){
    var sql = "insert into brand (name,describe,picid) values (?,?,?)";
    db.query(sql,[brand.name,brand.describe,brand.picid],callback);
}

Brand.getAll = function(callback){
    var sql= "select * from brand";
    db.query(sql,callback);
}