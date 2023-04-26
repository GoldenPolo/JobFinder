var express = require('express');
var userModel = require('../model/utilisateur');
var organisationModel = require('../model/organisation');
var router = express.Router();
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');

router.get('/', function(req, res, next) {
  res.redirect('/usersList');
});

router.get('/usersList', function (req, res, next) { 
  result = userModel.readall(function(result){
    res.render('./admin/usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

router.get('/userDetails', function (req, res, next) {
    result = userModel.read(req.query.id, function(result){
        res.render('./admin/userDetails', { title: 'Détails de l\'utilisateur', user: result, moment: moment});
    });
});

router.get('/organisationslist', function (req, res, next) {
    result = organisationModel.readall(function(result){
        res.render('./admin/organisationsList', { title: 'List des organisations', organisations: result });
    });
});


module.exports = router;
