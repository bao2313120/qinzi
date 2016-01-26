/**
 * Created by billtt on 10/10/14.
 */

$(function() {
    $("#btQuery").click(query);
    $("#btSave").click(saveSql);
    $("#sltSql").change(loadSql);
    $("#btRefreshResult").click(refreshResultList);
});

var _currentSqlName = null;

function loadSql() {
    var name = $("#sltSql").val();
    if (name == "" || name == _currentSqlName) {
        return;
    }
    disable("sltSql"); disable("sql"); disable("btQuery"); disable("btSave");
    $.getJSON("sql/get-sql", {name:name}, function(json) {
        enable("sltSql"); enable("sql"); enable("btQuery"); enable("btSave");
        if (json.sql) {
            $("#sql").val(json.sql);
            _currentSqlName = name;
        }
    }).fail(function() {
        enable("sltSql"); enable("sql"); enable("btQuery"); enable("btSave");
        showResult("Error getting SQL from server!");
    });
}

function saveSql() {
    var name = $("#sltSql").val();
    var sql = $("#sql").val();
    var saveName = prompt("保存为", name);
    if (saveName == null || saveName == "") {
        return;
    }
    disable("sltSql"); disable("sql"); disable("btQuery"); disable("btSave");
    $.getJSON("sql/save-sql", {name: saveName, sql: sql}, function(json) {
        enable("sltSql"); enable("sql"); enable("btQuery"); enable("btSave");
        if (json.err) {
            showResult(json.err);
        } else {
            if ($("option[value='" + saveName + "'").length == 0) {
                $("#sltSql").append("<option value='" + saveName + "'>" + saveName + "</option>");
            }
            if (saveName != name) {
                _currentSqlName = saveName;
                $("#sltSql").val(saveName);
            }
        }
    }).fail(function() {
        enable("sltSql"); enable("sql"); enable("btQuery"); enable("btSave");
        showResult("Error saving SQL to server!");
    });
}

function showResult(html) {
    $("#divResult").html(html);
}

function query() {
    var sql = $("#sql").val();
    if (sql == "") {
        return showResult("请输入查询内容");
    }
    var resultType = $('input[name=result]:checked').val();
    if (!resultType) {
        return showResult("请选择查看方式");
    }
    disable("btQuery", "正在查询");
    showResult('');
    $.getJSON('sql/query', {sql: sql, result: resultType}, function(json) {
        enable("btQuery", "查询");
        if (!json) {
            showResult("Error getting result from server!");
        } else {
            parseResult(json);
        }
    }).fail(function() {
        enable("btQuery", "查询");
        showResult("Error getting result from server!");
    });
}

function parseResult(json) {
    if (json.err) {
        return showResult(json.err);
    }
    if (json.download) {
        return showResult("已开始查询，请刷新结果列表");
    }
    if (!Array.isArray(json.result)) {
        var msg = "Query completed: \n" + JSON.stringify(json.result);
        return showResult(msg);
    }
    var items = json.result;
    var html = "<table>";
    for (var i=0; i<items.length; i++) {
        html += (i==0 ? "<thead>" : "") + "<tr><td>";
        html += items[i].join("</td><td>");
        html += "</td></tr>" + (i==0 ? "</thead>" : "");
    }
    html += "</table>";
    showResult(html);
}

function refreshResultList() {
    $.getJSON('sql/result', {}, function(json) {
        if (!json || !json.list) {
            return showResult("加载失败！");
        }
        const STATES = ["正在查询", "完成", "错误："];
        var html = "<table><thead><tr><td>时间</td><td>SQL</td><td>状态</td></tr></thead>";
        for (var i=0; i<json.list.length; i++) {
            var item = json.list[i];
            var succ = item.state == 1;
            var link = "<a href='download/" + item.time + ".zip'>";
            var sql = item.sql.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html += "<tr><td>" + (succ ? link : "") + moment(item.time).format("MM/DD/YYYY HH:mm:ss") + (succ ? "</a>" : "") + "</td>";
            html += "<td>" + sql + "</td>";
            html += "<td>" + STATES[item.state] + (item.state == 2 ? item.error : "") + "</td></tr>";
        }
        html += "</table>";
        showResult(html);
    }).fail(function() {
        showResult("加载失败！");
    });
}

function disable(id, text) {
    $("#" + id).prop("disabled", true);
    if (text) {
        $("#" + id).text(text);
    }
}

function enable(id, text) {
    $("#" + id).prop("disabled", false);
    if (text) {
        $("#" + id).text(text);
    }
}
