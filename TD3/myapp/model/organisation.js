var db = require('./db.js'); 

module.exports = {
    read: function (siren, callback) {
        db.query("select * from Organisation where siren = ?", [email], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from Organisation", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    create: function (siren, nom, type, siege, callback) {
        db.query("insert into Organisation(siren, nom, type, siege, validee) values(?, ?, ?, ?, ?)", [siren, nom, type, siege, 0], function (err, results) {
            if (err) throw err
            callback(results);
        });
    },

    delete: function (siren, callback) {
        db.query("delete from Organisation where siren = ?", [siren], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    update: function (siren, nom, type, siege, callback) {
        db.query("update Organisation set nom = ?, type = ?, siege = ? where siren = ?", [nom, type, siege, siren], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    search: function(query, callback) {
        db.query("SELECT * FROM Organisation WHERE nom LIKE ?", [`%${query}%`], function(err, results) {
          if (err) throw err;
          callback(results);
        });
      }
      

}