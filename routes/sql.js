/**
 * Created by billtt on 10/9/14.
 */

var express = require('express');
var router = express.Router();
var Util = require('../util.js');
var CustomSql = require('../model/CustomSql');
var db = require('../db');
var mkdirp = require('mkdirp');
var fs = require('fs');
var zip = require('easy-zip');
var config = require('config');

module.exports = router;
router.get('/', function(req, res) {
    CustomSql.getNameList(function(names) {
        res.render('sql', {sql: '', date: 'recent', names: names});
    });
});
router.get('/query', function(req, res) {
    var sql = req.param('sql');
    var download = req.param('result') == 'download';
    var json = {err: null, download: download};
    res.set('Content-Type', 'text/json');
    if (!sql || sql=='') {
        json.err = 'No SQL query found!';
        return res.end(JSON.stringify(json));
    }
    var words = validateSql(sql);
    if (words.length > 0) {
        json.err = 'Forbidden keywords in SQL: ' + words.join(',');
        return res.end(JSON.stringify(json));
    }
    var now = Date.now();
    db.query(sql,[], function(err, dbRes) {
        if (err) {
            if (download) {
                CustomSql.updateResult(now, CustomSql.RESULT_ERROR, err.message, function(){});
            } else {
                json.err = err.message;
                res.end(JSON.stringify(json));
            }
            return;
        }
        if (!dbRes) {
            dbRes = [];
        }
        json.rows = dbRes.length;
        // parse result
        var cols = [];
        var table = [cols];
        for (var i in dbRes) {
            var item = dbRes[i];
            for (var key in item) {
                if (typeof item[key] != 'function' && cols.indexOf(key) < 0) {
                    cols.push(key);
                }
            }
        }
        for (var i in dbRes) {
            var item = dbRes[i];
            var row = [];
            for (var j in cols) {
                var col = cols[j];
                row.push(item[col]);
            }
            table.push(row);
        }
        if (download) {
            saveResult(now, table, function(err) {
                if (err) {
                    CustomSql.updateResult(now, CustomSql.RESULT_ERROR, err, function(){});
                } else {
                    CustomSql.updateResult(now, CustomSql.RESULT_SUCC, '', function(){});
                }
            });
        } else {
            json.result = table;
            res.end(JSON.stringify(json));
        }
    });
    if (download) {
        CustomSql.addResult(now, sql, function(err) {
            json.result = 0;
            res.end(JSON.stringify(json));
        });
    }
});

function saveResult(time, table, callback) {
    var file = time;
    var path = __dirname + '/../public/download';
    mkdirp(path, function(err) {
        var content = '';
        for (var i=0; i<table.length; i++) {
            var record = table[i];
            for (var j=0; j<record.length; j++) {
                var val = record[j];
                var type =val instanceof Date;
                if (val instanceof Date){
                    val = val.toJSON();
                }
                if (isNaN(val) || i==0 || ('' + val).length > 10) {
                    val = '"=""' + ('' + val).replace(/\"/g, '""').replace(/\\/g, '\\\\') + '"""';
                }
                record[j] = val;
            }
            content += record.join(',') + '\n';
        }
        var ez = new zip.EasyZip();
        ez.file(file + '.csv', content);
        ez.writeToFile(path + '/' + file + '.zip', function(err) {
            callback(err);
        });
    });
}

router.get('/get-sql', function(req, res) {
    var json = {name: name};
    CustomSql.getSql(name, function(err, sql) {
        res.set('Content-Type', 'text/json');
        json.sql = sql;
        res.end(JSON.stringify(json));
    });
});

router.get('/save-sql', function(req, res) {
    var name = req.param('name');
    var sql = req.param('sql');
    var json = {};
    CustomSql.insertOrUpdate(name, sql, function(err) {
        json.err = err ? err.message : null;
        res.set('Content-Type', 'text/json');
        res.end(JSON.stringify(json));
    });
});

router.get('/result', function(req, res) {
    var json = {};
    CustomSql.getResultList(function(err, dbRes) {
        if (err) {
            json.err = err.message;
        } else {
            json.list = dbRes;
        }
        res.set('Content-Type', 'text/json');
        res.end(JSON.stringify(json));
    });
});

router.get('/remove-result', function(req, res) {
    var time = req.param('time');
    var json = {time: time};
    CustomSql.removeResult(time, function(err) {
        if (err) {
            json.err = err.message;
        }
        res.set('Content-Type', 'text/json');
        res.end(JSON.stringify(json));
    });
});

const INVALID_KEYWORDS = [
    'create', 'drop', 'delete', 'update', 'insert', 'alter', 'truncate'
];
function validateSql(sql) {
    var invalid = [];
    var sqlWords = sql.toLowerCase().split(/[ \t]/);
    for (var i in INVALID_KEYWORDS) {
        var word = INVALID_KEYWORDS[i];
        if (sqlWords.indexOf(word) >= 0) {
            invalid.push(word);
        }
    }
    return invalid;
}
