/**
 * Created by zhangxiaoxi on 14-4-22.
 */

var fs = require('fs');
var moment = require('moment');
var settings = require('config');
var log4js = require('log4js');
var db = require('./db');
var uuid = require('uuid');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function Util() {

}
Util.COMMEND_YES=1;
Util.COMMEND_NO=2;

Util.SUCCESS=1;
Util.FAIL=2;

Util.LIKE_YES=1;
Util.LIKE_NO=2;
Util.LIKE_NULL=0;//没有支持状态

Util.TEST_YES=2;
Util.TEST_NO=1;//是否完成问卷

Util.PAY_NO=1;
Util.PAY_YES=2;


Util.CATEGORY_ONE=1;//四类
Util.CATEGORY_TWO=2;//下面的


Util.ERR_ARGS=6;
Util.ERR_ARGS_FAILURE="参数错误";

Util.ERR_LOGIN_NO=7;
Util.ERR_LOGIN_NO_FAILURE="重新登录";

Util.ERR_OLDPASSWORD=8;
Util.ERR_OLDPASSWORD_FAILURE = "原密码错误";




Util.DEL_YES=2;
Util.DEL_NO=1;

Util.SUPPORT_TYPE_GOODS=1;
Util.SUPPORT_TYPE_ACTION=2;

Util.currentDate = function() {
    return moment().format("YYYY-MM-DD");
}


Util.errWarn = function(err) {
    if (err) {
        console.warn(err);
    }
};

Util.initLogger = function() {
    var debug = settings.debug;
    var logConfig = {
        "appenders": [
            {
                "type": "console",
                "layout": {
                    "type": "pattern",
                    "pattern": "%[%d %x{line} %p %] %m",
                    "tokens": {
                        "line": function () {
                            var line = new Error().stack.split('\n')[10];
                            // fix for various display text
                            line = ( line.indexOf(' (') >= 0 ?
                                line.split(' (')[1].substring(0, line.length - 1) : line.split('at ')[1]
                                );
                            line = line.split("/");
                            line = line[line.length - 1];
                            line = "[" + line.substr(0, line.length - 1) + "]";
                            return line;
                        }
                    }
                },
                'category': 'console'
            }
        ],
        replaceConsole: true
    };
    var port = process.argv[2];
    var flumeconf = {
        "type": "dateFile",
        "filename": __dirname+'/dataflume/log-' + port,
        "pattern": "-yyyy-MM-dd",
        "alwaysIncludePattern": true,
        "category": 'log_flume_data',
        "layout": {
            "type": "pattern",
            "pattern": "%m"
        }
    }
    logConfig.appenders.push(flumeconf);
    log4js.setGlobalLogLevel(debug ? "DEBUG" : "INFO");
    log4js.configure(logConfig, {});
};


Util.clone=function(obj){
    var o,i,j,k;
    if(typeof(obj)!="object" || obj===null)return obj;
    if(obj instanceof(Array))
    {
        o=[];
        i=0;j=obj.length;
        for(;i<j;i++)
        {
            if(typeof(obj[i])=="object" && obj[i]!=null)
            {
                o[i]=arguments.callee(obj[i]);
            }
            else
            {
                o[i]=obj[i];
            }
        }
    }
    else
    {
        o={};
        for(i in obj)
        {
            if(typeof(obj[i])=="object" && obj[i]!=null)
            {
                o[i]=arguments.callee(obj[i]);
            }
            else
            {
                o[i]=obj[i];
            }
        }
    }

    return o;
}


Util.splitStrNoRepeat = function(string){
    var strs = string.split("");
    var returnstrs = [];
    for(var i in strs){
        var str=strs[i];
        for(var j in returnstrs){
            if(str==returnstrs[j]){
                continue;
            }
        }
        str="%"+str+"%";
        returnstrs.push(str);
    }
    return returnstrs;
}

Util.setNoRepeat = function(goodsList){
    var goodsArr=[];
    for(var i in goodsList){
        var goods = goodsList[i];
        var isrepeat=false;
        for(var j in goodsArr){
            if(goods.goodsid===goodsArr[j].goodsid){
                isrepeat=true;
                break;
            }
        }
        if(!isrepeat){
            goodsArr.push(goods);
        }

    }
    return goodsArr;
}

Util.getUUid = function(){
    return uuid.v4();
}

Util.getFileName = function(file){
    var fName = Util.getUUid();
    switch (file.type){
        case "image/jpeg":
            fName = fName + ".jpg";
            break;
        case "image/png":
            fName = fName + ".png";
            break;
        default :
            fName =fName + ".png";
            break;
    }
    return fName;
}
module.exports = Util;