var express = require('express');
var app = express();
var userModel = require('../model/utilisateur');
var organisationModel = require('../model/organisation');
var router = express.Router();
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');

function requireAdmin(req, res, next) {
  if (req.session && req.session.userType === 'admin') {
    return next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.redirect('/usersList');
});

router.get('/usersList', requireAdmin, function (req, res, next) { 
  result = userModel.readall(function(result){
    res.render('./admin/usersList', {users: result });
  });
});

router.get('/searchUser', requireAdmin, (req, res) => {
  const query = req.query.q; // Récupère le paramètre "q" de l'URL
  userModel.searchByName(query, function(users) {
    res.render('./admin/usersList', {users: users});
  });
});

router.get('/userDetails', requireAdmin, function (req, res, next) {
    result = userModel.read(req.query.id, function(result){
        res.render('./admin/userDetails', { title: 'Détails de l\'utilisateur', user: result, moment: moment});
    });
});

router.get('/organisationslist', requireAdmin, function (req, res, next) {
    result = organisationModel.readall(function(result){
        res.render('./admin/organisationsList', { title: 'List des organisations', organisations: result });
    });
});

router.get('/searchOrganisation', function(req, res) {
  const query = req.query.q;
  organisationModel.search(query, function(organisations) {
    res.render('./admin/organisationsList', {organisations: organisations});
  });
});


module.exports = router;
