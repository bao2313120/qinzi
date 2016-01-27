var db=require('../db');
var Util=require('../util');
var Like = require('../model/Like');
var config = require('config');
function MemberAction() {

}
module.exports = MemberAction;

MemberAction.getMainPage = function(callback){
    var sql="select *,categorydescribe as 'describe' from member_action where ismainpage=1";
    db.query(sql,callback);
}

MemberAction.getActions = function(offset,pagesize,callback){
    var sql = "select *,categorydescribe as 'describe' from member_action where isdel=? order by time DESC";
    db.query(sql,[Util.DEL_NO],callback);
}


MemberAction.getActionById = function(actionid,callback){
    var sql = "select *,categorydescribe as 'describe' from member_action where actionid=?";
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

MemberAction.insertMemberActionPics = function(memberActionPic,callback){
    var sql = "insert into action_pic (actionid,picURL,actionpicnum) values (?,?,?)";
    memberActionPic.picURL=memberActionPic.picURL==null?"":memberActionPic.picURL.match(config.imageRegex);
    db.query(sql,[Number(memberActionPic.actionid),memberActionPic.picURL,
        Number(memberActionPic.actionpicnum)],callback);
}

MemberAction.getMaxpicNumByActionId = function(actionid,callback){
    var sql = "select max(actionpicnum)+1 as actionpicnum from action_pic where actionid=?";
    db.query(sql,actionid,callback);
}
MemberAction.getActionPicBypicURL = function(picURL,callback){
    var sql = "select * from action_pic where picURL=?";
    db.query(sql,picURL,callback);
}

MemberAction.delImageByActionPicId = function(actionpicid,callback){
    var sql="delete from action_pic where actionpicid=?";
    db.query(sql,actionpicid,callback);
}