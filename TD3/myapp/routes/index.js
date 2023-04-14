var express = require('express');
var router = express.Router();
var userModel = require('../model/utilisateur');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/successfulLogin', function(req, res, next) {
  console.log(req.query.type);
  if (req.query.type == 'candidat') {
    res.redirect('./candidat/offersList');
  } else if (req.query.type == 'recruteur') {
    res.redirect('./recruter/myOffersList');
  } else if (req.query.type == 'admin') {
    res.redirect('./admin/usersList');
  } else {
    res.render('login', {
      message: 'Identifiants incorrects'
    });
  }
});

router.post('/login', (req, res) => {
  let username = req.body.email;
  let password = req.body.pswd;
  result =  userModel.validPassword(username, password, function (result) {
    console.log(result);
    if (result[0]) {
      res.redirect('/successfulLogin?type=' + result[1]);
    } else {
      return res.render('./login', {
        message: 'Identifiants incorrects'
      })
    }
  });
});

module.exports = router;
