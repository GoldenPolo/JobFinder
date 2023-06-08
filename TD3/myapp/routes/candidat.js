var express = require('express');
var app = express();
var multer = require('multer');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var orgaModel = require('../model/organisation');
var userModel = require('../model/utilisateur');
var demAjoutOrga = require('../model/demandeAjoutOrganisation')
var router = express.Router();
var candidatureModel = require('../model/candidature');
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');
const paginateInfo = require('paginate-info');


function requireCandidat(req, res, next) {
  if (req.session && req.session.userType === 'candidat') {
    return next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', requireCandidat, function(req, res, next) {
  res.redirect('/offersList');
});

router.get('/offersList', requireCandidat, function(req, res) {
  let currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  let startIndex = (currentPage - 1) * perPage;
  let query = req.query.q; // Récupère le paramètre "q" de l'URL
  let order = req.query.order;
  let jobTypeFilter = req.query.jobTypeFilter;
  let salaryFilter = req.query.salaryFilter;
  let notif = req.query.notif;

  // Initialise les variables à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10;
  }
  if (!query) {
    query = '%';
  }
  if (!notif) {
    notif = false;
  }
  if (order == 'date') {
    order = 'Offre.datePublication DESC';
  } else if (order == 'salaire') {
    order = 'FichePoste.salaireMin DESC';
  } else if (order == 'distance') {
    order = 'distance';
  } else {
    order = 'Offre.datePublication DESC';
  }
  if (!jobTypeFilter) {
    jobTypeFilter = '%';
  }
  if (!salaryFilter) {
    salaryFilter = '%';
  }

  // Execute la requête SQL avec les variables
  offerModel.readAllFilters(query, order, jobTypeFilter, salaryFilter, startIndex, perPage, function (results) {
    const numOffers = results.length; // nombre total d'offres
    let totalPages = Math.ceil(numOffers / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    if (totalPages == 0) {
      totalPages = 1;
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    // traduction des parametres en variables
    if (order == 'Offre.datePublication DESC') {
      order = 'date';
    } else if (order == 'FichePoste.salaireMin DESC') {
      order = 'salaire';
    } else if (order == 'distance') {
      order = 'distance';
    } else {
      order = '';
    }
    if (query == '%') {
      query = '';
    }
    if (jobTypeFilter == '%') {
      jobTypeFilter = '';
    }
    if (salaryFilter == '%') {
      salaryFilter = '';
    }
    res.render('./candidat/offersList', { 
      offers: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      },
      moment: moment,
      query: query,
      order: order,
      jobTypeFilter: jobTypeFilter,
      salaryFilter: salaryFilter,
      notif: notif
    });
  });
});

router.get('/offerDetails', requireCandidat, function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./candidat/offerDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/addCandidature', requireCandidat, function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./candidat/addCandidature', { title: 'Ajout de candidature', offer: result, id : req.query.id });
  });
});

router.post('/newCandidature', requireCandidat, function (req, res, next) { 
  var piecesDossier = req.query.id + '-' + req.session.userid + '-';
  var storage = multer.diskStorage({
    destination:function(req, file, callback){
      callback(null, './public/uploads');
    },
    filename:function(req, file, callback){
      var temp_file_arr = file.originalname.split(".");
      var temp_file_name = temp_file_arr[0];
      var temp_file_extension = temp_file_arr[1];
      callback(null, piecesDossier + temp_file_name + '.' + temp_file_extension);
    }
  });
  var upload = multer({storage:storage}).array('files');
  upload(req, result, function (err){
    if (err){
      res.end('Error when uploading file!!');
    }
    else {
      result = candidatureModel.create(req.session.userid, req.query.id, piecesDossier, function(result){
        res.redirect('/candidat/myApplications?notif=Votre candidature a été enregistrée');
      });
    }
  });
});

router.get('/myApplications', requireCandidat, function (req, res, next) {
  let notif = req.query.notif;
  if (!notif) {
    notif = false;
  }
  result = candidatureModel.readCandidaturesCandidat(req.session.userid, function(result){
    res.render('./candidat/myApplications', { 
      title: 'Mes candidatures', 
      applications: result, 
      moment: moment,
      notif: notif
    });
  });
});

router.get('/applicationDetails', requireCandidat, function (req, res, next) {
  console.log(req.query.offre);
  result = candidatureModel.read(req.session.userid, req.query.offre, function(result){
    if (result.length == 0){
      res.end('Pas de candidature!! pour ' + req.query.offre);
    }
    res.render('./candidat/applicationDetails', { title: 'Détails de votre candidature', application: result, moment: moment});
  });
});

router.get('/addFiles', requireCandidat, function (req, res, next) { 
  res.render('./candidat/addFiles', { title: 'Ajout de fichiers', id : req.query.id });
});

router.post('/addToCandidature', requireCandidat, function (req, res, next) { 
  var piecesDossier = req.query.id + '-' + req.session.userid + '-';
  var storage = multer.diskStorage({
    destination:function(req, file, callback){
      callback(null, './public/uploads');
    },
    filename:function(req, file, callback){
      var temp_file_arr = file.originalname.split(".");
      var temp_file_name = temp_file_arr[0];
      var temp_file_extension = temp_file_arr[1];
      callback(null, piecesDossier + temp_file_name + '.' + temp_file_extension);
    }
  });
  var upload = multer({storage:storage}).array('files');
  upload(req, result, function (err){
    if (err){
      res.end('Error when uploading file!!');
    }
    else {
      result = candidatureModel.create(req.session.userid, req.query.id, piecesDossier, function(result){
        res.redirect('/candidat/myApplications?notif=Votre candidature a été mise à jour');
      });
    }
  });
});

router.get('/deleteCandidature', requireCandidat, function (req, res, next) {
  candidatureModel.delete(req.session.userid, req.query.id, function(result){
      res.redirect('/candidat/myApplications?notif=Votre candidature a été supprimée');
  });
});

router.get('/addOrganisation', requireCandidat, function (req, res, next) {
  res.render('./candidat/addOrganisation', { title: 'Ajouter mon organisation' });
});

router.post('/newOrga', requireCandidat, function (req, res, next) {
  const nomOrga = req.body.nomOrga;
  const siren = req.body.siren;
  const type = req.body.type;
  const siege = req.body.siege;
  orgaModel.create(siren, nomOrga, type, siege, function (result) {
   res.redirect('./offersList?notif=Votre demande a été enregistrée');
 })});
 
router.get('/becomeRecruter', requireCandidat, function (req, res, next) {
  result = orgaModel.readValidated(function(result){
    res.render('./candidat/becomeRecruter', { title: 'Devenir recruteur', orgas: result, moment: moment});
  });
});

router.post('/newRecruter', requireCandidat, function (req, res, next) {
  const siren = req.body.selectOrga;
  demAjoutOrga.create(req.session.userid, siren, function(result){
    res.redirect('/candidat/offersList?notif=Votre demande a été enregistrée');
  });
});

module.exports = router;
