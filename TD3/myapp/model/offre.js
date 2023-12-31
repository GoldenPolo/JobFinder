const db = require('./db.js')

module.exports = {
  readOffresPoste: function (fiche, callback) {
    db.query('select * from Offre where fichePoste= ?', [fiche], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readOffresOrganisation: function (organisation, startIndex, perPage, callback) {
    db.query('SELECT Offre.id, Offre.dateValidite, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.organisation = ?) LIMIT ?, ?', [organisation, startIndex, perPage], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readAll: function (callback) {
    db.query('select * from Offre', function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readAllDetailed: function (startIndex, perPage, callback) {
    db.query("SELECT Offre.id, Offre.dateValidite, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.etat = 'publiee') LIMIT ?, ?", [startIndex, perPage], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  read: function (id, callback) {
    db.query('select Offre.id, Offre.etat as offre_etat, Offre.dateValidite as offre_date_validite, Offre.nombrePiecesDemandees as offre_nombre_pieces_demandees, Offre.indications as offre_indications, Organisation.nom as organisation_nom, Organisation.type as organisation_type, Organisation.siege as organisation_siege, FichePoste.intitule as fiche_intitule, FichePoste.statut as fiche_statut, FichePoste.responsable as fiche_responsable, FichePoste.type as fiche_type, FichePoste.description as fiche_description, FichePoste.lieu as fiche_lieu, FichePoste.rythme as fiche_rythme, FichePoste.salaireMin as fiche_salaire_min, FichePoste.salaireMax as fiche_salaire_max from (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.id = ?)', [id], function (err, results) {
      if (err) throw err
      callback(results[0])
    })
  },

  create: function (etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation, callback) {
    db.query('insert into Offre(etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation) values (?, ?, ?, ?, ?, ?)', [etat, dateValidite, indications, nombrePiecesDemandees, fichePoste, organisation], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  delete: function (id, callback) {
    db.query('delete from Offre where id = ?', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  update: function (id, dateValidite, indications, nombrePiecesDemandees, callback) {
    db.query('update Offre set dateValidite = ?, indications = ?, nombrePiecesDemandees = ? where id = ?', [dateValidite, indications, nombrePiecesDemandees, id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  expireOffer: function (id) {
    db.query('update Offre set etat = ? where id = ?', ['expiree', id], function (err, results) {
      if (err) throw err
    })
  },

  revalidateOffer: function (id) {
    db.query('update Offre set etat = ? where id = ?', ['nonPubliee', id], function (err, results) {
      if (err) throw err
    })
  },

  publishOffer: function (id) {
    db.query('update Offre set etat = ? where id = ?', ['publiee', id], function (err, results) {
      if (err) throw err
    })
  },

  readAllFilters: function (query, order, latOrder, lonOrder, jobTypeFilter, salaryFilter, statusFilter, startIndex, perPage, callback) {
    console.log(query)
    console.log(order)
    console.log(latOrder)
    console.log(lonOrder)
    console.log(jobTypeFilter)
    console.log(salaryFilter)
    console.log(statusFilter)
    console.log(startIndex)
    console.log(perPage)

    if (order === 'distance') {
      order = `(POW((longitude-${lonOrder}),2) + POW((latitude-${latOrder}),2))`
    }

    db.query("SELECT COUNT(*) AS total FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.etat = 'publiee') AND (FichePoste.intitule LIKE ?) AND (FichePoste.type LIKE ?) AND (FichePoste.salaireMin > ?) AND (FichePoste.statut LIKE ?)", [`%${query}%`, jobTypeFilter, salaryFilter, statusFilter], function (err, result) {
      console.log(result[0])
      if (err) throw err
      const total = result[0].total
      const totalPages = Math.ceil(total / perPage)
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      const SQLquery = "SELECT Offre.id, Offre.dateValidite, Offre.datePublication, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.etat = 'publiee') AND (FichePoste.intitule LIKE '%" + query + "%') AND (FichePoste.type LIKE '" + jobTypeFilter + "') AND (FichePoste.salaireMin >= '" + salaryFilter + "') AND (FichePoste.statut LIKE '" + statusFilter + "') ORDER BY " + order + ' LIMIT ' + startIndex + ',' + perPage
      console.log(SQLquery)
      db.query(SQLquery, function (err, results) {
        if (err) throw err
        console.log(results)
        callback(results, pages, total)
      })
    })
  },

  readOffresOrganisationFilters: function (organisation, query, statusFilter, startIndex, perPage, callback) {
    console.log(organisation)
    console.log(query)
    console.log(statusFilter)
    console.log(startIndex)
    console.log(perPage)
    db.query('SELECT COUNT(*) AS total FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.organisation = ?) AND (FichePoste.intitule LIKE ?) AND (Offre.etat = ?)', [organisation, `%${query}%`, statusFilter], function (err, result) {
      if (err) throw err
      const total = result[0].total
      const totalPages = Math.ceil(total / perPage)
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      db.query('SELECT Offre.id, Offre.dateValidite, Offre.etat, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.organisation = ?) AND (FichePoste.intitule LIKE ?) AND (Offre.etat = ?) LIMIT ?, ?', [organisation, `%${query}%`, statusFilter, startIndex, perPage], function (err, results) {
        if (err) throw err
        callback(results, pages, total)
      })
    })
  },

  searchByIntituleRecruter: function (query, organisation, startIndex, perPage, callback) {
    db.query('SELECT COUNT(*) AS total FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.organisation = ?) AND (FichePoste.intitule LIKE ?)', [organisation, `%${query}%`], function (err, result) {
      if (err) throw err
      const total = result[0].total
      const totalPages = Math.ceil(total / perPage)
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      db.query('SELECT Offre.id, Offre.dateValidite, Organisation.nom, FichePoste.intitule, FichePoste.statut, FichePoste.type, FichePoste.lieu, FichePoste.rythme, FichePoste.salaireMin, FichePoste.salaireMax FROM (Offre INNER JOIN Organisation ON (Offre.organisation = Organisation.siren) INNER JOIN FichePoste ON (Offre.fichePoste = FichePoste.id)) WHERE (Offre.organisation = ?) AND (FichePoste.intitule LIKE ?) LIMIT ?, ?', [organisation, `%${query}%`, startIndex, perPage], function (err, results) {
        if (err) throw err
        callback(results, pages, total)
      })
    })
  }
}
