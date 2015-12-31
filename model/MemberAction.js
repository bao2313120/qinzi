var db=require('../db');
var Util=require('../util');
var Like = require('../model/Like');
function MemberAction() {

}
module.exports = MemberAction;

MemberAction.getMainPage = function(callback){
    var sql="select * from member_action where ismainpage=1";
    db.query(sql,callback);
}

MemberAction.getActions = function(offset,pagesize,callback){
    var sql = "select * from member_action where isdel=? order by time DESC";
    db.query(sql,[Util.DEL_NO],callback);
}

MemberAction.getActionById = function(actionid,callback){
    var sql = "select * from member_action where actionid=?";
    db.query(sql,actionid,callback);
}

MemberAction.getActionPicsById = function(actionid,callback){
    var sql = "select * from action_pic where actionid=? order by actionpicnum ASC ";
    db.query(sql,actionid,callback);
}

MemberAction.addUserActSupport = function(id,actionid,actionpicid,callback){
    var sql = "update action_pic set actsupport=actsupport+1 where actionpicid=?";
    db.query(sql,actionpicid,function(err,dbres){
        Like.insertActionPic(id,actionid,actionpicid,Util.SUPPORT_TYPE_ACTION,Util.LIKE_YES,callback);
    })
}

MemberAction.addUserDisSupport = function(id,actionid,actionpicid,callback){
    var sql="update action_pic set dissupport = dissupport+1 where actionpicid=?";
    db.query(sql,actionid,function(err,dbres){
        Like.insertActionPic(id,actionid,actionpicid,Util.SUPPORT_TYPE_ACTION,Util.LIKE_NO,callback);
    })
}

