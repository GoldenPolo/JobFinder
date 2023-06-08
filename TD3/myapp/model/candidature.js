const db = require('./db.js')

module.exports = {
  read: function (user, offer, callback) {
    db.query('select Candidature.date as candidature_date, Candidature.piecesDossier, Offre.id as offre_id, Offre.etat as offre_etat, Offre.dateValidite as offre_date_validite, Offre.nombrePiecesDemandees as offre_nombre_pieces_demandees, Offre.indications as offre_indications, Organisation.nom as organisation_nom, Organisation.type as organisation_type, Organisation.siege as organisation_siege, FichePoste.intitule as fiche_intitule, FichePoste.statut as fiche_statut, FichePoste.responsable as fiche_responsable, FichePoste.type as fiche_type, FichePoste.description as fiche_description, FichePoste.lieu as fiche_lieu, FichePoste.rythme as fiche_rythme, FichePoste.salaireMin as fiche_salaire_min, FichePoste.salaireMax as fiche_salaire_max from (Candidature INNER JOIN Offre ON (Candidature.offre = Offre.id) INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Candidature.candidat = ?) AND (Candidature.offre = ?)', [user, offer], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readCandidaturesCandidat: function (id, callback) {
    db.query('select Candidature.date as candidature_date, Candidature.piecesDossier, Offre.id as offre_id, Offre.etat as offre_etat, Offre.dateValidite as offre_date_validite, Offre.nombrePiecesDemandees as offre_nombre_pieces_demandees, Offre.indications as offre_indications, Organisation.nom as organisation_nom, Organisation.type as organisation_type, Organisation.siege as organisation_siege, FichePoste.intitule as fiche_intitule, FichePoste.statut as fiche_statut, FichePoste.responsable as fiche_responsable, FichePoste.type as fiche_type, FichePoste.description as fiche_description, FichePoste.lieu as fiche_lieu, FichePoste.rythme as fiche_rythme, FichePoste.salaireMin as fiche_salaire_min, FichePoste.salaireMax as fiche_salaire_max from (Candidature INNER JOIN Offre ON (Candidature.offre = Offre.id) INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Candidature.candidat = ?)', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readCandidaturesToAllMyOffres: function (organisation, callback) {
    db.query('select * from (Candidature INNER JOIN Offre ON Candidature.offre = Offre.id) WHERE (Offre.organisation = ?)', [organisation], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readCandidaturesToMyOffer: function (offer, callback) {
    db.query('select Candidature.date, Candidature.piecesDossier,  FichePoste.intitule, Utilisateur.nom, Utilisateur.prenom from (Candidature INNER JOIN Offre ON Candidature.offre = Offre.id INNER JOIN Utilisateur ON Candidature.candidat = Utilisateur.id INNER JOIN FichePoste on Offre.fichePoste = FichePoste.id) WHERE (Candidature.offre = ?)', [offer], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readAll: function (callback) {
    db.query('select * from Candidature', function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  create: function (candidat, offre, piecesDossier, callback) {
    db.query('insert into Candidature(candidat, offre, date, piecesDossier) values (?, ?, ?, ?)', [candidat, offre, new Date(), piecesDossier], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  delete: function (candidat, offre, callback) {
    db.query('delete from Candidature where candidat = ? and offre = ?', [candidat, offre], function (err, results) {
      if (err) throw err
      callback(results)
    })
  }
}
