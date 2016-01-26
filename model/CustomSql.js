/**
 * Created by billtt on 10/10/14.
 */

var db = require('../db');

function CustomSql() {

}
module.exports = CustomSql;

CustomSql.RESULT_WORKING = 0;
CustomSql.RESULT_SUCC = 1;
CustomSql.RESULT_ERROR = 2;

CustomSql.insertOrUpdate = function(name, value, callback) {
    var sql = 'insert into custom_sql (name, `sql`) values (?, ?) on duplicate key update `sql`=values(`sql`)';
    db.query(sql, [name, value], callback);
};

CustomSql.getSql = function(name, callback) {
    var sql = 'select `sql` from custom_sql where name=?';
    db.query(sql, [name], function(err, dbRes) {
        if (err || !dbRes || dbRes.length == 0) {
            return callback(err, null);
        }
        callback(null, dbRes[0].sql);
    });
};

CustomSql.getNameList = function(callback) {
    var sql = 'select name from custom_sql';
    db.query(sql,[], function(err, dbRes) {
        if (err) {
            return callback([]);
        }
        var names = [];
        for (var i in dbRes) {
            names.push(dbRes[i].name);
        }
        callback(names);
    });
};

CustomSql.getResultList = function(callback) {
    var sql = 'select `time`,`sql`,`state`,`error` from custom_sql_result order by `time` desc';
    db.query(sql,[], callback);
};

CustomSql.removeResult = function(time, callback) {
    var sql = 'delete from custom_sql_result where `time`=?';
    db.query(sql, [time], callback);
};

CustomSql.addResult = function(time, query, callback) {
    var sql = 'insert into custom_sql_result (`time`, `sql`, `state`, `error`) values (?, ?, ?, "")';
    db.query(sql, [time, query, CustomSql.RESULT_WORKING], callback);
};

CustomSql.updateResult = function(time, state, error, callback) {
    var sql = 'update custom_sql_result set `state`=?, `error`=? where `time`=?';
    db.query(sql, [state, error, time], callback);
};
