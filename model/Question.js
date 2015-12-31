var db=require('../db');
var Util = require('../util');

function Question() {

}
module.exports = Question;

Question.getAllTest = function(callback){
    var sql = "select testid,test,inuse from test";
    db.query(sql,callback);
}

Question.insertTest = function(test,callback){
    var sql = "insert into test (test) values(?)";
    db.query(sql,callback);
}

Question.disUseTest = function(testid,callback){
    var sql = "update test set inuse=? where testid=?";
    db.query(sql,[Util.DEL_YES,testid],callback);
}

Question.useTest = function(testid,callback){
    var sql = "update test set inuse=? where testid=?";
    db.query(sql,[Util.DEL_NO,testid],callback);
}

Question.disUseOtherTest = function(testid,callback){
    var sql = "update test set inuse=? where testid<>?";
    db.query(sql,[Util.DEL_YES,testid],callback);
}

Question.insertQuestion = function(question,callback){
    var sql = "insert into question(testid,question,A,B,C,D,E) values(?,?,?,?,?,?,?)";
    db.query(sql,[question.testid,question.question,question.A,question.B,question.C,
        question.D,question.E],callback);
}

Question.delQuestion = function(questionid,callback){
    var sql = "update question set isdel=? where questionid=?";
    db.query(sql,[Util.DEL_YES,questionid],callback);
}


Question.getAllQuestionByTestId = function(testid,callback){
    var sql = "select * from question where testid=? and isdel=?";
    db.query(sql,[testid,Util.DEL_NO],callback);
}

Question.getInUseQuestion = function(callback){
    var sql = "select a.* from question a join test b on a.testid=b.testid where b.inuse=?";
    db.query(sql,Util.DEL_NO,callback);
}