var express = require('express');
var router = express.Router();
var userModel = require('../model/utilisateur');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/successfulLogin', function(req, res, next) {
  result = userModel.readType(req.query.id, function(result){
    if (result[0].type == 'Candidat') {
      res.redirect('/candidat');
    } else if (result[0].type == 'Recruteur') {
      res.redirect('/recruteur');
    } else if (result[0].type == 'Administrateur') {
      res.redirect('/admin');
    }
  });
});

router.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  result =  userModel.validPassword(username, password, function (result) {
    if (result[0]) {
      res.redirect('/successfulLogin?id=' + result[1]);
    } else {
      return res.render('register', {
        message: 'Identifiants incorrects'
      })
    }
  });
});

module.exports = router;
