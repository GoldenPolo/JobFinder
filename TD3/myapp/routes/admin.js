var express = require('express');
var app = express();
var userModel = require('../model/utilisateur');
var organisationModel = require('../model/organisation');
var router = express.Router();
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');
const paginateInfo = require('paginate-info');


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

router.get('/usersList', requireAdmin, function(req, res) {
  let currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  let startIndex = (currentPage - 1) * perPage;
  let query = req.query.q; // Récupère le paramètre "q" de l'URL
  let notif = req.query.notif;
  
  // Initialise les variables de pagination à des valeurs par défaut
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

  // Execute la requête SQL avec les variables de pagination
  userModel.readAllFilters(query, startIndex, perPage, function (results) {
    const numUsers = results.length; // nombre total d'utilisateurs
    let totalPages = Math.ceil(numUsers / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    if (totalPages == 0) {
      totalPages = 1;
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    if (query == '%') {
      query = '';
    }
    res.render('./admin/usersList', { 
      users: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      },
      query: query,
      notif: notif
    });
  });
});

router.get('/userDetails', requireAdmin, function (req, res, next) {
    result = userModel.read(req.query.id, function(result){
        res.render('./admin/userDetails', { title: 'Détails de l\'utilisateur', user: result, moment: moment});
    });
});

router.get('/userModif', requireAdmin, function (req, res, next) {
  result = userModel.read(req.query.id, function(result){
      res.render('./admin/userModif', { title: 'Modification de l\'utilisateur', user: result, moment: moment});
  });
});

router.post('/userModified', requireAdmin, function (req, res, next) {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const tel = req.body.tel;
  
  userModel.update(req.query.id, email, nom, prenom, tel, function (req, res, next) {});
  res.redirect("./usersList")
});

router.get('/userAdmin', requireAdmin, function (req, res, next) {
  userModel.becomeAdmin(req.query.id, function(result){
      res.render('./admin/userAdmin', { title: 'Transformation de l\'utilisateur en admin'});
  });
});

router.get('/userDelete', requireAdmin, function (req, res, next) {
  userModel.delete(req.query.id, function(result){
      res.render('./admin/userDelete', { title: 'Suppression de l\'utilisateur'});
  });
});

router.get('/organisationsList', requireAdmin, function(req, res) {
  let currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  let startIndex = (currentPage - 1) * perPage;
  let query = req.query.q; // Récupère le paramètre "q" de l'URL
  let statusFilter = req.query.statusFilter; // Récupère le paramètre "statusFilter" de l'URL
  let notif = req.query.notif;
  
  // Initialise les variables de pagination à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10;
  }
  if (!query) {
    query = '%';
  }
  if (!statusFilter) {
    statusFilter = 'attente';
  }
  if (!notif) {
    notif = false;
  }

  // Execute la requête SQL avec les variables de pagination
  organisationModel.readAllFilters(query, statusFilter, startIndex, perPage, function (results) {
    const numOrga = results.length; // nombre total d'orga
    let totalPages = Math.ceil(numOrga / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    if (totalPages == 0) {
      totalPages = 1;
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    if (query == '%') {
      query = '';
    }
    res.render('./admin/organisationsList', { 
      organisations: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      },
      query: query,
      statusFilter: statusFilter,
      notif: notif
    });
  });
});

router.get('/orgaDetails', requireAdmin, function (req, res, next) {
  result = organisationModel.read(req.query.siren, function(result){
      res.render('./admin/orgaDetails', {
        orga: result[0], 
        moment: moment});
  });
});

router.get('/valideOrga', requireAdmin, function (req, res, next) {
  organisationModel.valider(req.query.siren, function(result){
      res.redirect('./organisationsList');
  });
});

router.get('/refuseOrga', requireAdmin, function (req, res, next) {
  organisationModel.refuser(req.query.siren, function(result){
      res.redirect('./organisationsList');
  });
});

router.get('/searchOrganisation', requireAdmin, function(req, res) {
  const query = req.query.q;
  organisationModel.search(query, function(organisations) {
    res.render('./admin/organisationsList', {organisations: organisations});
  });
});


module.exports = router;
