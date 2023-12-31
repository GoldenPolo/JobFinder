const db = require('./db.js')

module.exports = {
  readFicheId: function (id, callback) {
    db.query('select * from FichePoste where id= ?', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readFicheIntitule: function (intitule, callback) {
    db.query('select * from FichePoste where intitule= ?', [intitule], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readFichesOrga: function (orga, callback) {
    db.query('select * from FichePoste where orga= ?', [orga], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readAll: function (callback) {
    db.query('select * from FichePoste', function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  create: function (intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, orga, latitude, longitude, callback) {
    db.query('insert into FichePoste(intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, orga, latitude, longitude) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, orga, latitude, longitude], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  update: function (id, intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, latitude, longitude, callback) {
    db.query('update FichePoste set intitule = ?, statut = ?, responsable = ?, type = ?, lieu = ?, rythme = ?, salaireMin = ?, salaireMax = ?, description = ?, latitude = ?, longitude = ? where id = ?', [intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, latitude, longitude, id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  delete: function (id, callback) {
    db.query('delete from FichePoste where id = ?', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  }
}
