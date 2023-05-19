var express = require('express');

var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var orgaModel = require('../model/organisation');
var userModel = require('../model/utilisateur');

var router = express.Router();

router.get('/users', function (req, res, next) { 
    result=userModel.readall(0, 10, function(result){
        res.status(200).json(result); });
    });

router.get('/offers', function (req, res, next) {
    result=offerModel.readAllDetailed(1, 10, function(result){
        res.status(200).json(result); });
    });

module.exports = router;