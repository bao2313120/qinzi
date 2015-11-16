var config = require('config');
var mysql = require('mysql');

var pool = mysql.createPool(config.mysql_qinzi);

module.exports = pool;


pool.escape = function(str){
    return mysql.escape(str);
};