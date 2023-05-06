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
  
  // Initialise les variables de pagination à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10;
  }

  // Execute la requête SQL avec les variables de pagination
  userModel.readall(startIndex, perPage, function (results) {
    const numUsers = results.length; // nombre total d'utilisateurs
    const totalPages = Math.ceil(numUsers / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    res.render('./admin/usersList', { 
      users: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      }
    });
  });
});


router.get('/searchUser', requireAdmin, (req, res) => {
  const query = req.query.q; // Récupère le paramètre "q" de l'URL
  let currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  let startIndex = (currentPage - 1) * perPage;
  
  // Initialise les variables de pagination à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10;
  }

  // Execute la requête SQL avec les variables de pagination
  userModel.searchByName(query, startIndex, perPage, function (results) {
    const numUsers = results.length; // nombre total d'utilisateurs
    const totalPages = Math.ceil(numUsers / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    res.render('./admin/usersList', { 
      users: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      }
    });
  });
});


router.get('/userDetails', requireAdmin, function (req, res, next) {
    result = userModel.read(req.query.id, function(result){
        res.render('./admin/userDetails', { title: 'Détails de l\'utilisateur', user: result, moment: moment});
    });
});

router.get('/organisationsList', function(req, res) {
  let currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  let startIndex = (currentPage - 1) * perPage;
  
  // Initialise les variables de pagination à des valeurs par défaut
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (isNaN(perPage) || perPage < 1) {
    perPage = 10;
  }

  // Execute la requête SQL avec les variables de pagination
  organisationModel.readPage(startIndex, perPage, function (results) {
    const numOrganisations = results.length; // nombre total d'orga
    const totalPages = Math.ceil(numOrganisations / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    res.render('./admin/organisationsList', { 
      organisations: results,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      }
    });
  });
});


router.get('/searchOrganisation', function(req, res) {
  const query = req.query.q;
  organisationModel.search(query, function(organisations) {
    res.render('./admin/organisationsList', {organisations: organisations});
  });
});


module.exports = router;
