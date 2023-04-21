var express = require('express');
var userModel = require('../model/utilisateur');
var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var router = express.Router();
const moment = require('moment'); //installer moment (npm install moment --save)
require('moment/locale/fr.js');
moment.locale('fr');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/myOffersList');
});

router.get('/myOffersList', function (req, res, next) { 
  result = offerModel.readOffresOrganisation(req.session.user.organisation, function(result){
    res.render('./recruter/myOffersList', { title: 'Mes offres', offers: result, moment });
  });
});

router.get('/myOfferDetails', function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./recruter/myOfferDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/applicationsList', function (req, res, next) {
  result = candidatureModel.readCandidaturesOffre(req.query.id, function(result){
    res.render('./recruter/applicationsList', { title: 'Candidatures', applications: result, moment });
  });
});

router.get('/addRecruter', function (req, res, next) {
  res.render('./recruter/addRecruter', { title: 'Ajouter un recruteur' });
});

module.exports = router;
