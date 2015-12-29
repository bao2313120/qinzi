var db=require('../db');

function Question() {

}
module.exports = Question;

Question.getAllTest = function(callback){
    var sql = "select testid,test from test";
    db.query(sql,callback);
}

Question.insertTest = function(test,callback){
    var sql = "insert into test (test) values(?)";
    db.query(sql,callback);
}

Question.insertQuestion = function(question,callback){
    var sql = "insert into question(testid,question,A,B,C,D,E) values(?,?,?,?,?,?)";
    db.query(sql,[question.testid,question.question,question.A,question.B,question.C,
        question.D,question.E],callback);
}


Question.getAllQuestionByTestId = function(testid,callback){
    var sql = "select * from question where testid=?";
    db.query(sql,testid,callback);
}