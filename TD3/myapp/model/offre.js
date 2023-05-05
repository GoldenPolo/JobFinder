var db = require('./db.js');

module.exports = {
    readOffresPoste: function (fiche, callback) {
        db.query("select * from Offre where fichePoste= ?", [fiche], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readOffresOrganisation: function (organisation, callback) {
        db.query("select Offre.id, Offre.dateValidite, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax from (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.organisation = ?)", [organisation], function(err, results) {
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
        db.query("select Offre.id, Offre.dateValidite, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax from (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.etat = 'publiee')", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    read: function (id, callback) {
        db.query("select Offre.etat as offre_etat, Offre.dateValidite as offre_date_validite, Offre.nombrePiecesDemandees as offre_nombre_pieces_demandees, Offre.indications as offre_indications, Organisation.nom as organisation_nom, Organisation.type as organisation_type, Organisation.siege as organisation_siege, FichePoste.intitule as fiche_intitule, FichePoste.statut as fiche_statut, FichePoste.responsable as fiche_responsable, FichePoste.type as fiche_type, FichePoste.description as fiche_description, FichePoste.lieu as fiche_lieu, FichePoste.rythme as fiche_rythme, FichePoste.salaireMin as fiche_salaire_min, FichePoste.salaireMax as fiche_salaire_max from (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.id = ?)", [id], function (err, results) {
            if (err) throw err;
            callback(results[0]);
        });
    },

    create: function (etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation) {
        db.query("insert into Offre(etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation) values (?, ?, ?, ?, ?, ?)", [etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    delete: function (id, callback) {
        db.query("delete from Offre where id = ?", [id], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}
