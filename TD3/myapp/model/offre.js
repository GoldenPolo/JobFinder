var db = require('./db.js');

module.exports = {
    readOffresPoste: function (fiche, callback) {
        db.query("select * from Candidature where fichePoste= ?",fiche, function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readOffresOrganisation: function (organisation, callback) {
        db.query("select * from Candidature where organisation= ?",organisation, function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    
    readAll: function (callback) {
        db.query("select * from Offre", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readAllDetailed: function (callback) {
        db.query("select * from (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.etat = 'publiee')", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    create: function (id, etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation) {
        db.query("insert into Offre(id, etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation) values (?, ?, ?, ?, ?, ?, ?)", [id, etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    delete: function (id, callback) {
        db.query("delete from Offre where id = ?", id, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}
