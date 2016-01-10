var db=require('../db');
var Util=require('../util');
function Contribute() {

}
module.exports = Contribute;

Contribute.insert = function(contribute,callback){
    var sql = "insert into contribute  (id,message,time) values (?,?,?)";
    db.query(sql,[contribute.id,contribute.message,contribute.time],callback);
}

Contribute.insertPic = function(contributePic,callback){
    var sql = "insert into contributepic (contributepicname,contributeid) values (?,?)";
    db.query(sql,[contributePic.contributepicname,contributePic.contributeid],callback);
}