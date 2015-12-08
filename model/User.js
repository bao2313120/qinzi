var db=require('../db');

function User() {

}
module.exports = User;

User.insert = function(user,callback){
    var sql = "insert into user(id,phonenum,password,petname) values (?,?,?,?)";
    db.query(sql,[user.id,user.phonenum,user.password,user.petname],callback);
}

User.query = function(id,callback){
    var sql = "select * from user where id=?";
    db.query(sql,[id],callback);
}


