var mysql = require("mysql");

var pool = mysql.createPool({
    host: "tuxa.sme.utc", //ou localhost user: "ai16pxxxx",
    password: "1m2NNgy7ZIrC",
    database: "sr10p030",
    user: "sr10p030"
});

module.exports = pool;