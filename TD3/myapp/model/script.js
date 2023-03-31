var mysql = require("mysql");

var pool = mysql.createPool({
    host: "tuxa.sme.utc", //ou localhost user: "ai16pxxxx",
    password: "KVBDSB595bjj",
    database: "sr10p036"
});

module.exports = pool;