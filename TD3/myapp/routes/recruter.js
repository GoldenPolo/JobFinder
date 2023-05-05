var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var userModel = require('../model/utilisateur');
var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var router = express.Router();
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/myOffersList');
});

router.get('/myOffersList', function (req, res, next) { 
  result = offerModel.readOffresOrganisation(req.session.userorganisation, function(result){
    res.render('./recruter/myOffersList', { title: 'Mes offres', offers: result, moment: moment});
  });
});

router.get('/myOfferDetails', function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./recruter/myOfferDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/applicationsList', function (req, res, next) {
  result = candidatureModel.readCandidaturesToAllMyOffres(req.session.userorganisation, function(result){
    console.log(result);
    res.render('./recruter/applicationsList', { title: 'Candidatures', applications: result, moment: moment});
  });
});

router.get('/addRecruter', function (req, res, next) {
  res.render('./recruter/addRecruter', { title: 'Ajouter un recruteur' });
});

router.get('/addOffre', function (req, res, next) {
  res.render('candidat/addOffre', { title: 'Ajouter une offre' });
});

router.post('/newOffer', function (req, res, next) {
  const dateValid = req.body.dateValid;
  const indic = req.body.indic;
  const nbPieces = req.body.nbPieces;
  //comment récupérer fichePoste et organisation?
  offerModel.create(etat, dateValid, indic, nbPieces, fichePoste, organisation, function (req, res, next) {
   res.redirect('/myOffersList');
 })});

module.exports = router;
