var db=require('../db');

function User() {

}
module.exports = User;

User.insert = function(user,callback){
    var sql = "insert into user(id,phonenum,password) values (?,?,?)";
    db.query(sql,[user.id,user.phonenum,user.password],callback);
}

User.query = function(id,callback){
    var sql = "select * from user where id=?";
    db.query(sql,[id],callback);
}

