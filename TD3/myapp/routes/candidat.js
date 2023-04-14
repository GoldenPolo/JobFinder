var express = require('express');
var offerModel = require('../model/offre');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/offersList');
});

router.get('/offersList', function (req, res, next) { 
  result = offerModel.readAllDetailed(function(result){
    res.render('./candidat/offersList', { title: 'Offres', offers: result });
  });
});

router.get('/offerDetails', function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./candidat/offerDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/myApplications', function (req, res, next) {
  result = CandidaturesModel.readAll(req.session.user.id, function(result){
    res.render('./candidat/myApplications', { title: 'Mes candidatures', applications: result });
  });
});

router.get('/addOrganisation', function (req, res, next) {
  res.render('./candidat/addOrganisation', { title: 'Ajouter mon organisation' });
});

module.exports = router;
