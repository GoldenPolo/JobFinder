var db = require('./db.js');

module.exports = {
    readCandidaturesCandidat: function (id, callback) {
        db.query("select * from (Candidature INNER JOIN Offre ON (Candidature.offre = Offre.id) INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Candidature.candidat = ?)", [id], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readCandidaturesToAllMyOffres: function (organisation, callback) {
        db.query("select * from (Candidature INNER JOIN Offre ON Candidature.offre = Offre.id) WHERE (Offre.organisation = ?)", [organisation], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    
    readAll: function (callback) {
        db.query("select * from Candidature", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    create: function (candidat, offre, date, piecesDossier, callback) {
        db.query("insert into Candidature(candidat, offre, date, piecesDossier) values (?, ?, ?, ?)", [candidat, offre, date, piecesDossier], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    delete: function (candidat, offre, callback) {
        db.query("delete from Candidature where candidat = ? and offre = ?", [candidat, offre], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}