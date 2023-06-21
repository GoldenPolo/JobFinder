/* eslint-disable n/no-callback-literal */
const db = require('./db.js')

module.exports = {
  read: function (id, callback) {
    db.query('select * from Utilisateur where id = ?', [id], function (err, results) {
      if (err) {
        callback(null, err)
      } else if (results.length === 0) {
        callback(results, new TypeError('Error : pas d\'utilisateur avec cet id!'))
      } else callback(results[0], null)
    })
  },

  readId: function (email, callback) {
    db.query('select id from Utilisateur where email = ?', [email], function (err, results) {
      if (err) {
        callback(null, err)
      } else if (results.length === 0) {
        callback(results, new TypeError('Error : pas d\'utilisateur avec cet email!'))
      } else callback(results[0], null)
    })
  },

  readType: function (id, callback) {
    db.query('select type from Utilisateur where id = ?', [id], function (err, results) {
      if (err) {
        callback(null, err)
      } else if (results.length === 0) {
        callback(results, new TypeError('Error : pas d\'utilisateur avec cet id!'))
      } else callback(results[0], null)
    })
  },

  readOrganisation: function (id, callback) {
    db.query('select organisation from Utilisateur where id = ?', [id], function (err, results) {
      if (err) {
        callback(null, err)
      } else if (results.length === 0) {
        callback(results, new TypeError('Error : pas d\'utilisateur avec cet id!'))
      } else callback(results[0], null)
    })
  },

  readAllFilters: function (query, startIndex, perPage, callback) {
    console.log(query)
    console.log(startIndex)
    console.log(perPage)
    db.query('SELECT COUNT(*) AS total FROM Utilisateur WHERE nom LIKE ? OR prenom LIKE ?', [`%${query}%`, `%${query}%`, startIndex, perPage], function (err, result) {
      if (err) throw err
      const total = result[0].total
      const totalPages = Math.ceil(total / perPage)
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      db.query('SELECT * FROM Utilisateur WHERE nom LIKE ? OR prenom LIKE ?', [`%${query}%`, `%${query}%`, startIndex, perPage], function (err, result) {
        if (err) throw err
        callback(result, pages, total)
      })
    })
  },

  readPassword: function (email, callback) {
    db.query('select motDePasse, type, id from Utilisateur where email = ?', [email], function (err, results) {
      if (err) throw err
      callback(results[0])
    })
  },

  validPassword: function (email, password, callback) {
    db.query('select motDePasse, type, id from Utilisateur where email = ?', [email], function (err, rows) {
      if (err) throw err
      if (rows.length === 1 && rows[0].motDePasse === password) {
        callback([true, rows[0].type, rows[0].id])
      } else {
        callback([false])
      }
    })
  },

  create: function (email, nom, prenom, pwd, type, telephone, callback) {
    db.query('insert into Utilisateur(email, nom, prenom, motDePasse, type, telephone, dateCreation, estActif) output Inserted.id values(?, ?, ?, ?, ?, ?, ?, ?)', [email, nom, prenom, pwd, type, telephone, new Date(), 1], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  delete: function (id, callback) {
    db.query('delete from Utilisateur where id = ?', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  update: function (id, email, nom, prenom, tel, callback) {
    db.query('update Utilisateur set email = ?, nom = ?, prenom = ?, telephone = ? where id = ?', [email, nom, prenom, tel, id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  becomeRecruter: function (id, orga, callback) {
    db.query("update Utilisateur set type = 'recruteur', organisation = ? where id = ?", [orga, id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  becomeAdmin: function (id, callback) {
    db.query("update Utilisateur set type = 'admin' where id = ?", [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  }

}
