var db = require('./db.js'); 

module.exports = {
    read: function (siren, callback) {
        db.query("select Utilisateur.nom as nom, Utilisateur.prenom as prenom, Utilisateur.id as id from (DemandeAjoutOrganisation INNER JOIN Utilisateur ON DemandeAjoutOrganisation.utilisateur = Utilisateur.id) where DemandeAjoutOrganisation.organisation = ?", [siren], function (err, results) {
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
        db.query("insert into DemandeAjoutOrganisation(utilisateur, organisation, validee) values(?, ?, ?)", [utilisateur, organisation, 0], function (err, results) {
            if (err) throw err
            callback(results);
        });
    },

    delete: function (user, orga, callback) {
        db.query("delete from DemandeAjoutOrganisation where utilisateur = ? and organisation = ?", [user, orga], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

}