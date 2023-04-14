var db = require('./db.js'); 

module.exports = {
    read: function (siren, callback) {
        db.query("select * from DemandeAjoutOrganisation where id = ?", [email], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from DemandeAjoutOrganisation", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    create: function (utilisateur, organisation, callback) {
        db.query("insert into DemandeAjoutOrganisation(utilisateur, organisation, validee) values(?, ?)", [utilisateur, organisation, 0], function (err, results) {
            if (err) throw err
            callback(results);
        });
    },

    delete: function (id, callback) {
        db.query("delete from DemandeAjoutOrganisation where id = ?", id, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

}