var db = require('./db.js');
module.exports = {
    readCandidaturesCandidat: function (id, callback) {
        db.query("select * from Candidature where Utilisateur= ?",id, function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    
    readAll: function (callback) {
        db.query("select * from Candidatures", function (err, results) {
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