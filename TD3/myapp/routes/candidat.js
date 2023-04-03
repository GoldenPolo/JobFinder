var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/offersList', function (req, res, next) { 
  result = offerModel.readall(function(result){
    res.render('offersList', { title: 'Offres', offers: result });
  });
});

router.get('/offerDetails', function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('offerDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/myApplications', function (req, res, next) {
  result = CandidaturesModel.readall(req.session.user.id, function(result){
    res.render('myApplications', { title: 'Mes candidatures', applications: result });
  });
});

router.get('/addOrganisation', function (req, res, next) {
  res.render('addOrganisation', { title: 'Ajouter mon organisation' });
});

module.exports = router;
