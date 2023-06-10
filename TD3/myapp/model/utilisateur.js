/* eslint-disable n/no-callback-literal */
const db = require('./db.js')

module.exports = {
  read: function (id, callback) {
    db.query('select * from Utilisateur where id = ?', [id], function (err, results) {
      if (err) throw err
      callback(results[0])
    })
  },

  readType: function (id, callback) {
    db.query('select type from Utilisateur where id = ?', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readOrganisation: function (id, callback) {
    db.query('select organisation from Utilisateur where id = ?', [id], function (err, results) {
      if (err) throw err
      callback(results)
    })
  },

  readall: function (page, size, callback) {
    const start = page * size
    db.query('select * from Utilisateur limit ?, ?', [start, size], function (err, results) {
      if (err) throw err

      // Get the total count of users
      db.query('select count(*) as count from Utilisateur', function (err, countResult) {
        if (err) throw err

        // Generate pagination info
        const totalItems = countResult[0].count
        const currentPage = page
        const pageSize = size
        const totalPages = Math.ceil(totalItems / pageSize)
        const startPage = 1
        const endPage = totalPages
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)
        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i)

        const paginationInfo = {
          totalItems,
          currentPage,
          pageSize,
          totalPages,
          startPage,
          endPage,
          startIndex,
          endIndex,
          pages
        }

        // Return the results and pagination info
        callback(results, paginationInfo)
      })
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
    db.query('insert into Utilisateur(email, nom, prenom, motDePasse, type, telephone, dateCreation, estActif) values(?, ?, ?, ?, ?, ?, ?, ?)', [email, nom, prenom, pwd, type, telephone, new Date(), 1], function (err, results) {
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
