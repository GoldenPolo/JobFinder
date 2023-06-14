const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const userModel = require('../model/utilisateur')
const offerModel = require('../model/offre')
const candidatureModel = require('../model/candidature')
const demAjoutOrgaModel = require('../model/demandeAjoutOrganisation')
const fichePosteModel = require('../model/fichePoste')
const router = express.Router()
const moment = require('moment')
const AdmZip = require('adm-zip')
require('moment/locale/fr.js')
moment.locale('fr')
const path = require('node:path')
const fs = require('node:fs')

function requireRecruteur (req, res, next) {
  if (req.session && req.session.userType === 'recruteur') {
    return next()
  } else {
    res.redirect('/login')
  }
}

function deleteFilesOffer (offer) {
  const dirPath = path.resolve(__dirname, '../public/uploads')
  const files = fs.readdirSync(dirPath).filter(file => file.startsWith(offer))
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

function updateEtatOffers () {
  offerModel.readAll(function (offres) {
    offres.forEach((offer) => {
      if (offer.etat !== 'expiree' && moment(offer.dateValidite, 'YYYY-MM-DD').isBefore(Date())) {
        offerModel.expireOffer(offer.id)
      }
      if (offer.etat === 'expiree' && moment(offer.dateValidite, 'YYYY-MM-DD').isAfter(Date())) {
        offerModel.revalidateOffer(offer.id)
      }
    })
  })
}

/* GET users listing. */
router.get('/', requireRecruteur, function (req, res, next) {
  res.redirect('/myOffersList')
})

router.get('/myOffersList', requireRecruteur, function (req, res, next) {
  updateEtatOffers()
  let currentPage = req.query.page || 1
  let perPage = req.query.perPage || 10
  const startIndex = (currentPage - 1) * perPage
  let query = req.query.q // Récupère le paramètre "q" de l'URL
  let statusFilter = req.query.statusFilter
  let notif = req.query.notif

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
    statusFilter = 'publiee'
  }
  if (!notif) {
    notif = false
  }

  offerModel.readOffresOrganisationFilters(req.session.userorganisation, query, statusFilter, startIndex, perPage, function (result) {
    const numOffers = result.length // nombre total d'offres
    let totalPages = Math.ceil(numOffers / perPage) // nombre total de pages
    const pages = [] // tableau des numéros de page
    let notif = req.query.notif
    if (totalPages === 0) {
      totalPages = 1
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    if (query === '%') {
      query = ''
    }
    if (!notif) {
      notif = false
    }
    res.render('./recruter/myOffersList', {
      title: 'Nos offres',
      offers: result,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages,
        pages
      },
      moment,
      query,
      statusFilter,
      notif
    })
  })
})

router.get('/myOfferDetails', requireRecruteur, function (req, res, next) {
  offerModel.read(req.query.id, function (result) {
    console.log(result)
    res.render('./recruter/myOfferDetails', { title: 'Détails de l\'offre', offer: result, id: req.query.id, moment })
  })
})

router.get('/myOfferModif', requireRecruteur, function (req, res, next) {
  offerModel.read(req.query.id, function (result) {
    res.render('./recruter/myOfferModif', { title: 'Modification de l\'offre', offer: result, id: req.query.id, moment })
  })
})

router.post('/myOfferModified', requireRecruteur, function (req, res, next) {
  const dateVal = req.body.dateValidite
  const nbPiecesDem = req.body.nbPiecesDem
  const indications = req.body.indications
  offerModel.update(req.query.id, dateVal, indications, nbPiecesDem, function (resultat) {
    res.redirect('/recruter/myOffersList?notif=Votre offre a été mise à jour')
  })
})

router.get('/deleteOffer', requireRecruteur, function (req, res, next) {
  offerModel.delete(req.query.id, function (result) {
    deleteFilesOffer(req.query.id)
    res.redirect('/recruter/myOffersList')
  })
})

router.get('/applicationsList', requireRecruteur, function (req, res, next) {
  let notif = req.query.notif
  let intituleList = []
  let intituleFilter = req.query.intituleFilter
  if (!notif) {
    notif = false
  }
  if (!intituleFilter) {
    intituleFilter = '%'
  }
  if (!req.query.id) {
    candidatureModel.readCandidaturesToAllMyOffers(req.session.userorganisation, intituleFilter, function (result) {
      for (let i = 0; i < result.length; i++) {
        if (!intituleList.includes(result[i].intitule)) intituleList.push(result[i].intitule)
      }
      if (intituleList.length === 0) {
        intituleList = false
      }
      if (intituleFilter === '%') {
        intituleFilter = false
      }
      res.render('./recruter/applicationsList', {
        title: 'Candidatures',
        applications: result,
        intituleList,
        intituleFilter,
        moment,
        notif
      })
    })
  } else {
    candidatureModel.readCandidaturesToMyOffer(req.query.id, function (result) {
      console.log(result)
      res.render('./recruter/applicationsList', {
        title: 'Candidatures',
        applications: result,
        moment,
        notif
      })
    })
  }
})

router.get('/download', requireRecruteur, function (req, res, next) {
  const dirPath = path.resolve(__dirname, '../public/uploads')
  const files = fs.readdirSync(dirPath).filter(file => file.startsWith(req.query.piecesDoss))
  const zip = new AdmZip()
  files.forEach(file => {
    zip.addLocalFile(dirPath + '\\' + file)
  })
  const downloadName = req.query.prenom + '_' + req.query.nom + '.zip'
  const data = zip.toBuffer()
  res.set('Content-Type', 'application/octet-stream')
  res.set('Content-Disposition', `attachment; filename=${downloadName}`)
  res.set('Content-Length', data.length)
  res.send(data)
})

router.get('/addRecruter', requireRecruteur, function (req, res, next) {
  let notif = req.query.notif
  if (!notif) {
    notif = false
  }
  demAjoutOrgaModel.read(req.session.userorganisation, function (resultat) {
    res.render('./recruter/addRecruter', {
      demandes: resultat,
      notif
    })
  })
})

router.get('/acceptRecruter', requireRecruteur, function (req, res, next) {
  userModel.becomeRecruter(req.query.id, req.session.userorganisation, function (resultat) {
    demAjoutOrgaModel.delete(req.query.id, req.session.userorganisation, function (resultat) {
      res.redirect('/recruter/addRecruter?notif=La demande a été acceptée')
    })
  })
})

router.get('/refuseRecruter', requireRecruteur, function (req, res, next) {
  demAjoutOrgaModel.delete(req.query.id, req.session.userorganisation, function (resultat) {
    res.redirect('/recruter/addRecruter?notif=La demande a été refusée')
  })
})

router.get('/addOffer', requireRecruteur, function (req, res, next) {
  fichePosteModel.readFichesOrga(req.session.userorganisation, function (result) {
    res.render('./recruter/addOffer', { title: 'Ajouter une offre', fiches: result })
  })
})

router.post('/newOffer', requireRecruteur, function (req, res, next) {
  const dateValid = req.body.dateValidite
  const indic = req.body.indications
  const nbPieces = req.body.nbPiecesDem
  const fiche = req.body.selectFiche
  offerModel.create('nonPubliee', dateValid, indic, nbPieces, fiche, req.session.userorganisation, function (req, res, next) {
    res.render('./recruter/myOffersList', { notif: 'L\'offre a été créée' })
  })
})

router.get('/myFichesList', requireRecruteur, function (req, res, next) {
  fichePosteModel.readFichesOrga(req.session.userorganisation, function (result) {
    res.render('./recruter/myFichesList', { title: 'Liste des fiches de poste', fiches: result, notif: false })
  })
})

router.get('/myFicheDetails', requireRecruteur, function (req, res, next) {
  fichePosteModel.readFicheId(req.query.id, function (result) {
    res.render('./recruter/myFicheDetails', { title: 'Détails de la fiche', fiche: result[0], moment })
  })
})

router.get('/myFicheModif', requireRecruteur, function (req, res, next) {
  fichePosteModel.readFicheId(req.query.id, function (result) {
    res.render('./recruter/myFicheModif', { title: 'Modification de la fiche', fiche: result[0], moment })
  })
})

router.post('/myFicheModified', requireRecruteur, function (req, res, next) {
  const intitule = req.body.intitule
  const statut = req.body.statut
  const type = req.body.type
  const description = req.body.description
  const responsable = req.body.responsable
  const rythme = req.body.rythme
  const salaireMin = req.body.salaireMin
  const salaireMax = req.body.salaireMax
  const lieu = req.body.lieu
  fichePosteModel.update(req.query.id, intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, function (resultat) {
    res.redirect('/recruter/myFichesList',
      {
        notif: 'La fiche a été mise à jour'
      })
  })
})

router.get('/myFicheDelete', requireRecruteur, function (req, res, next) {
  offerModel.readOffresPoste(req.query.id, function (offres) {
    fichePosteModel.delete(req.query.id, function (result) {
      offres.forEach((offre) => {
        deleteFilesOffer(offre.id)
      })
      res.render('./recruter/myFichesList',
        {
          notif: 'La fiche a été supprimée'
        })
    })
  })
})

router.get('/newFiche', requireRecruteur, function (req, res, next) {
  res.render('./recruter/newFiche', { title: 'Ajouter une fiche de poste' })
})

router.post('/newFiche', requireRecruteur, function (req, res, next) {
  const intitule = req.body.intitule
  const statut = req.body.statut
  const type = req.body.type
  const description = req.body.description
  const responsable = req.body.responsable
  const rythme = req.body.rythme
  const salaireMin = req.body.salaireMin
  const salaireMax = req.body.salaireMax
  const lieu = req.body.lieu
  fichePosteModel.create(intitule, statut, responsable, type, lieu, rythme, salaireMin, salaireMax, description, req.session.userorganisation, function (resultat) {
    res.render('./recruter/myFichesList',
      {
        notif: 'La fiche a été ajoutée'
      })
  })
})

module.exports = router
