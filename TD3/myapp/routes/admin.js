const express = require('express')
const userModel = require('../model/utilisateur')
const organisationModel = require('../model/organisation')
const candidatureModel = require('../model/candidature')
const demAjoutOrgaModel = require('../model/demandeAjoutOrganisation')
const router = express.Router()
const moment = require('moment')
require('moment/locale/fr.js')
moment.locale('fr')
const path = require('node:path')
const fs = require('node:fs')

function requireAdmin (req, res, next) {
  if (req.session && req.session.userType === 'admin') {
    return next()
  } else {
    res.redirect('/login')
  }
}

function deleteFilesCandidature (piecesDossier) {
  const dirPath = path.resolve(__dirname, '../public/uploads')
  const files = fs.readdirSync(dirPath).filter(file => file.startsWith(piecesDossier))
  if (files) {
    files.forEach((file) => {
      try {
        fs.unlinkSync(dirPath + '\\' + file)
      } catch (err) {
        console.error(err)
      }
    })
  }
}

router.get('/', function (req, res, next) {
  res.redirect('/usersList')
})

router.get('/usersList', requireAdmin, function (req, res) {
  let currentPage = req.query.page || 1
  let perPage = req.query.perPage || 10
  const startIndex = (currentPage - 1) * perPage
  let query = req.query.q // Récupère le paramètre "q" de l'URL
  let notif = req.query.notif

  // Initialise les variables de pagination à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10
  }
  if (!query) {
    query = '%'
  }
  if (!notif) {
    notif = false
  }

  // Execute la requête SQL avec les variables de pagination
  userModel.readAllFilters(query, startIndex, perPage, function (results) {
    const numUsers = results.length // nombre total d'utilisateurs
    let totalPages = Math.ceil(numUsers / perPage) // nombre total de pages
    const pages = [] // tableau des numéros de page
    if (totalPages === 0) {
      totalPages = 1
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    if (query === '%') {
      query = ''
    }
    res.render('./admin/usersList', {
      users: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages,
        pages
      },
      query,
      notif
    })
  })
})

router.get('/userDetails', requireAdmin, function (req, res, next) {
  userModel.read(req.query.id, function (result) {
    res.render('./admin/userDetails', {
      title: 'Détails de l\'utilisateur',
      user: result,
      moment
    })
  })
})

router.get('/userModif', requireAdmin, function (req, res, next) {
  userModel.read(req.query.id, function (result) {
    res.render('./admin/userModif', {
      title: 'Modification de l\'utilisateur',
      user: result,
      moment
    })
  })
})

router.post('/userModified', requireAdmin, function (req, res, next) {
  const nom = req.body.nom
  const prenom = req.body.prenom
  const email = req.body.email
  const tel = req.body.tel

  userModel.update(req.query.id, email, nom, prenom, tel, function (req, res, next) {})
  res.redirect("./usersList?notif=L'utilisateur a été modifié")
})

router.get('/userAdmin', requireAdmin, function (req, res, next) {
  userModel.becomeAdmin(req.query.id, function (result) {
    console.log('EMAIL DE CONFIRMATION ENVOYÉ')
    res.redirect("/admin/usersList?notif=L'utilisateur est maintenant administrateur")
  })
})

router.get('/userDelete', requireAdmin, function (req, res, next) {
  candidatureModel.readCandidaturesCandidat(req.query.id, function (candidatures) {
    userModel.delete(req.query.id, function (result) {
      candidatures.forEach((candidature) => {
        deleteFilesCandidature(candidature.piecesDossier)
      })
      res.redirect("/admin/usersList?notif=L'utilisateur a été supprimé")
    })
  })
})

router.get('/organisationsList', requireAdmin, function (req, res) {
  let currentPage = req.query.page || 1
  let perPage = req.query.perPage || 10
  const startIndex = (currentPage - 1) * perPage
  let query = req.query.q // Récupère le paramètre "q" de l'URL
  let statusFilter = req.query.statusFilter // Récupère le paramètre "statusFilter" de l'URL
  let notif = req.query.notif

  // Initialise les variables de pagination à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10
  }
  if (!query) {
    query = '%'
  }
  if (!statusFilter) {
    statusFilter = 'attente'
  }
  if (!notif) {
    notif = false
  }

  // Execute la requête SQL avec les variables de pagination
  organisationModel.readAllFilters(query, statusFilter, startIndex, perPage, function (results) {
    const numOrga = results.length // nombre total d'orga
    let totalPages = Math.ceil(numOrga / perPage) // nombre total de pages
    const pages = [] // tableau des numéros de page
    if (totalPages === 0) {
      totalPages = 1
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    if (query === '%') {
      query = ''
    }
    res.render('./admin/organisationsList', {
      organisations: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages,
        pages
      },
      query,
      statusFilter,
      notif
    })
  })
})

router.get('/orgaDetails', requireAdmin, function (req, res, next) {
  organisationModel.read(req.query.siren, function (result) {
    res.render('./admin/orgaDetails', {
      orga: result[0],
      moment
    })
  })
})

router.get('/valideOrga', requireAdmin, function (req, res, next) {
  demAjoutOrgaModel.read(req.query.siren, function (demandes) {
    demandes.forEach((demande) => {
      userModel.becomeRecruter(demande.id, req.query.siren, function () {
        demAjoutOrgaModel.delete(demande.id, req.query.siren, function () {})
      })
    })
    organisationModel.valider(req.query.siren, function (result) {
      res.redirect("/admin/organisationsList?notif=L'organisation a été validée")
    })
  })
})

router.get('/refuseOrga', requireAdmin, function (req, res, next) {
  organisationModel.refuser(req.query.siren, function (result) {
    res.redirect("/admin/organisationsList?notif=L'organisation a été refusée")
  })
})

router.get('/searchOrganisation', requireAdmin, function (req, res) {
  const query = req.query.q
  organisationModel.search(query, function (organisations) {
    res.render('./admin/organisationsList', { organisations })
  })
})

module.exports = router
