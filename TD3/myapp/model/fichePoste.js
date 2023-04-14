var db = require('./db.js');

module.exports = {
    readFicheIntitule: function (intitule, callback) {
        db.query("select * from FichePoste where intitule= ?", [intitule], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readAll: function (callback) {
        db.query("select * from FichePoste", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    create: function (id, intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description) {
        db.query("insert into FichePoste(id, intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    delete: function (id, callback) {
        db.query("delete from FichePoste where id = ?", [id], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}