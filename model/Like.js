var db=require('../db');
var Util=require('../util');
function Like() {

}
module.exports = Like;

Like.insert= function(id,goodsid,type,callback){
    var sql = "insert into like (id,goodsid,type) values (?,?,?)";
    db.query(sql,[id,goodsid,type],callback);
}

Like.getAllLikeByIdAndType = function(id,type,callback){
    var sql = "select * from like where id=? and type=?";
    db.query(sql,[id,type],callback);
}

Like.getAllLikeById = function(id,callback){
    var sql = "select * from like where id=?";
    db.query(sql,id,callback);
}