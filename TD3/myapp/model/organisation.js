var db = require('./db.js'); 

module.exports = {
    read: function (siren, callback) {
        db.query("select * from Organisation where siren = ?", [siren], function (err, results) {
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

    readValidated: function (callback) {
        db.query("select * from Organisation WHERE statut = 'validee'", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readPage: function(startIndex, perPage, callback) {
        db.query('SELECT * FROM Organisation LIMIT ?, ?', [startIndex, perPage], function(err, results) {
          if (err) throw err;
          callback(results);
        });
      },      

    create: function (siren, nom, type, siege, callback) {
        db.query("insert into Organisation(siren, nom, type, siege, statut) values(?, ?, ?, ?, 'attente')", [siren, nom, type, siege], function (err, results) {
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

    valider: function (siren, callback) {
        db.query("update Organisation set statut = 'validee' where siren = ?", siren, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    refuser: function (siren, callback) {
        db.query("update Organisation set statut = 'refusee' where siren = ?", siren, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    search: function(query, callback) {
        db.query("SELECT * FROM Organisation WHERE nom LIKE ?", [`%${query}%`], function(err, results) {
          if (err) throw err;
          callback(results);
        });
    },

    readAllFilters: function(query, statusFilter, startIndex, perPage, callback) {
        console.log(query);
        console.log(statusFilter);
        console.log(startIndex);
        console.log(perPage);
        db.query("SELECT COUNT(*) AS total FROM Organisation WHERE nom LIKE ? AND statut = ?", [`%${query}%`, statusFilter], function(err, result) {
            if (err) throw err;
            const total = result[0].total;
            const totalPages = Math.ceil(total / perPage);
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            db.query("SELECT * FROM Organisation WHERE nom LIKE ? AND statut = ? LIMIT ?, ?", [`%${query}%`, statusFilter, startIndex, perPage], function(err, result) {
            if (err) throw err;
            callback(result, pages, total);
            });
        });
    },
      

}