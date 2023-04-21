var express = require('express');
var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var router = express.Router();
const moment = require('moment'); //installer moment (npm install moment --save)
require('moment/locale/fr.js');
moment.locale('fr');

router.get('/', function(req, res, next) {
  res.redirect('/offersList');
});

router.get('/offersList', function (req, res, next) { 
  result = offerModel.readAllDetailed(function(result){
    res.render('./candidat/offersList', { title: 'Offres', offers: result, moment });
  });
});

router.get('/offerDetails', function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./candidat/offerDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/myApplications', function (req, res, next) {
  result = candidatureModel.readCandidaturesCandidat(req.session.user.id, function(result){
    res.render('./candidat/myApplications', { title: 'Mes candidatures', applications: result, moment });
  });
});

router.get('/addOrganisation', function (req, res, next) {
  res.render('./candidat/addOrganisation', { title: 'Ajouter mon organisation' });
});

module.exports = router;
