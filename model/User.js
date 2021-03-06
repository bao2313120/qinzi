var db=require('../db');
var config = require('config');
var Util = require('../util');

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

User.queryAll = function(callback){
    var sql = "select * from user";
    db.query(sql,callback);
}

User.updateAddressAndPhone = function(id,address,phone,callback){
    var sql = "update user set recieveaddress=? , recievephone=? where id=?";
    db.query(sql,[address,phone,id],callback);
}

User.updateHeadPic = function(id,headpic,callback){
    headpic=headpic==null?"":headpic.match(config.imageRegex)[0];
    var sql = "update user set headpic=? where id=?";
    db.query(sql,[headpic,id],function(err,dbres){
        callback(err,dbres);
    });
}

User.updatePetName = function(id,petname,callback){
    var sql = "update user set petname=? where id=?";
    db.query(sql,[petname,id],callback);
}

User.updateEmail = function(id,email,callback){
    var sql = "update user set email=? where id=?";
    db.query(sql,[email,id],callback);
}

User.updatePassWord = function(id,oldpass,newpass,callback){
    var sql="update user set password=? where id=? and password=?";
    db.query(sql,[newpass,id,oldpass],callback);
}

User.updatePhone = function(id,phone,callback){
    var sql = "update user set phonenum=? where id=?";
    db.query(sql,[phone,id],callback);
}

User.getVipList = function(callback){
    var sql = "select * from viplevel";
    db.query(sql,callback);
}

User.getVipLevelPage = function(viplevelid,callback){
    var sql = "select * from viplevelpage where viplevelid=?";
    db.query(sql,viplevelid,callback);
}

User.insertVipLevel = function(vip,callback){
    var pic=vip.pic;
    pic =pic==null?"":pic.match(config.imageRegex)[0];
    var sql ="insert into viplevel (viplevel,vipposter,pic,money,viptitle) values(?,?,?,?,?)";
    db.query(sql,[vip.viplevel,vip.vipposter,pic,vip.money,vip.viptitle],function(err,dbres){
        var insertId=dbres.insertId;
        User.insertVipPage(insertId,vip.vippage,callback);
    });
}

User.insertVipPage = function(viplevelid,page,callback){
    var sql = "insert into viplevelpage (viplevelid,viplevelpage) values (?,?)";
    db.query(sql,[viplevelid,page],callback);
}

User.updateVip = function(vip,callback){
    var pic=vip.pic;
    pic =pic==null?"":pic.match(config.imageRegex)[0];
    var sql="update viplevel set viplevel=?,vipposter=?,pic=?,money=?,viptitle=? where viplevelid=? ";
    db.query(sql,[vip.viplevel,vip.vipposter,pic,vip.money,vip.viptitle,vip.viplevelid],callback);
}

User.updateVipPage = function(viplevelid,page,callback){
    var sql="update viplevelpage set viplevelpage=? where viplevelid=?";
    db.query(sql,[page,viplevelid],callback);
}


User.getVipLevel = function(viplevelid,callback){
    var sql="select a.*,b.viplevelpage as viplevelpage from viplevel a left join viplevelpage b on a.viplevelid=b.viplevelid where a.viplevelid=?"
    db.query(sql,viplevelid,callback);
}

User.delVip=function(viplevelid,callback){
    var sql ="delete from viplevel where viplevelid=?";
    db.query(sql,viplevelid,callback);
}

User.updateIsTestQuestion = function(id,isTestState,callback){
    var sql = "update user set istestquestion=? where id=?";
    db.query(sql,[isTestState,id],callback);
}

User.insertOrder = function(order,callback){
    var sql = "insert into userorder (id,recievename,recievephone,recieveaddress,pushphone," +
        " viplevel,vipprice) values (?,?,?,?,?,?,?)";
    db.query(sql,[order.id,order.name,order.phone,order.address,
        order.pushphone,order.viplevel,order.vipprice],callback);
}

User.getOrderByOrderId= function(orderid,callback){
    var sql= "select * from userorder where orderid=?";
    db.query(sql,orderid,callback);
}

User.insertPayDetail = function(pay,callback){
    console.info(pay);
    var sql = "insert into paydetail (id,orderid,data) values (?,?,?)";
    db.query(sql,[pay.id,pay.orderid,JSON.stringify(pay.data)],callback);
}

User.updateVipLevel = function(id,vipLevel,callback){
    var sql ="update user set viplevel=? where id=? ";
    db.query(sql,[vipLevel,id],callback);
}

User.login = function (name,pwd,callback) {
    var sql = "select * from useradmin where name=? and password=?";
    db.query(sql,[name,pwd],callback);
}

User.updateOrderPayStatus = function(orderid,callback){
    var sql = "update userorder set ispay=? where orderid=?";
    db.query(sql,[Util.PAY_YES,orderid],callback)
}