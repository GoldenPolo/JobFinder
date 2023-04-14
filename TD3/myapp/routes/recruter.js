var express = require('express');
var userModel = require('../model/utilisateur');
var offerModel = require('../model/offre');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/myOffersList');
});

router.get('/myOffersList', function (req, res, next) { 
  result = offerModel.readOffresOrganisation(req.session.user.organisation, function(result){
    res.render('myOffersList', { title: 'Mes offres', offers: result });
  });
});

router.get('/myOfferDetails', function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('myOfferDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/offerApplications', function (req, res, next) {
  result = offerModel.readCandidaturesOffre(req.query.id, function(result){
    res.render('offerApplications', { title: 'Candidatures', applications: result });
  });
});

module.exports = router;
