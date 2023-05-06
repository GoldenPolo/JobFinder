var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var orgaModel = require('../model/organisation');
var userModel = require('../model/utilisateur');
var router = express.Router();
var candidatureModel = require('../model/candidature');
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');

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

router.get('/offersList', requireCandidat, function (req, res, next) { 
  result = offerModel.readAllDetailed(function(result){
    res.render('./candidat/offersList', { title: 'Offres', offers: result, moment: moment});
  });
});

router.get('/offerDetails', requireCandidat, function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./candidat/offerDetails', { title: 'Détails de l\'offre', offer: result });
  });
});

router.get('/myApplications', requireCandidat, function (req, res, next) {
  result = candidatureModel.readCandidaturesCandidat(req.session.userid, function(result){
    res.render('./candidat/myApplications', { title: 'Mes candidatures', applications: result, moment: moment});
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
  orgaModel.create(siren, nom, type, siege, function (req, res, next) {
   res.redirect('/offersList');
 })});
 

router.get('/addUser', function (req, res, next) {
 res.render('./candidat/addUser', { title: 'Ajouter un utilisateur' });
});

router.post('/newUser', function (req, res, next) {
 const prenom = req.body.prenom;
 const nom = req.body.nom;
 const pwd = req.body.pwd;
 const tel = req.body.tel;
 userModel.create(nom, prenom, pwd, 'candidat', tel, function (req, res, next) {
  res.redirect('/offersList');
})});

router.get('/addCandidature', requireCandidat, function (req, res, next) {
 res.render('./candidat/addCandidature', { title: 'Ajouter une candidature' });
});

router.post('/newCandidature', requireCandidat, function (req, res, next) {
 const files = req.body.files;
 //comment avoir l'offre actuelle???
 candidatureModel.create(req.user.id, offre, new Date().toLocaleDateString(), files, function (req, res, next) {
  res.redirect('/offersList');
})});

module.exports = router;
