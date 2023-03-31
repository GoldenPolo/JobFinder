var db = require('./db.js'); 

module.exports = {
    read: function (siren, callback) {
        db.query("select * from demandeAjoutOrganisation where id = ?", email, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from demandeAjoutOrganisation", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    create: function (utilisateur, organisation, callback) {
        db.query("insert into demandeAjoutOrganisation(utilisateur, organisation, validee) values(?, ?)", [utilisateur, organisation, 0], function (err, results) {
            if (err) throw err
            callback(results);
        });
    },

    delete: function (id, callback) {
        db.query("delete from demandeAjoutOrganisation where id = ?", id, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

}