var express = require('express');
var router = express.Router();
var userModel = require('../model/utilisateur');
const paginateInfo = require('paginate-info');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('login');
});

router.get('/login', function(req, res, next) {
  let notif = req.query.notif;
  if (!notif) {
    notif = false;
  }
  res.render('login', { 
    message : false,
    notif : notif 
  });
});

router.get('/successfulLogin', function(req, res, next) {
  console.log(req.query.type);
  req.session.userType = req.query.type;
  if (req.query.type == 'candidat') {
    res.redirect('./candidat/offersList');
  } else if (req.query.type == 'recruteur') {
    result = userModel.readOrganisation(req.session.userid, function (result) {
      console.log(result);
      req.session.userorganisation = result[0].organisation;
      res.redirect('./recruter/myOffersList');
    });
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
      var session = req.session;
      session.useremail = req.body.username;
      session.userid = result[2];
      res.redirect('/successfulLogin?type=' + result[1]);
    } else {
      return res.render('./login', {
        message: 'Identifiants incorrects',
        notif : false
      })
    }
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { message : false });
});
 
router.post('/signup', function (req, res, next) {
  const prenom = req.body.prenom;
  const nom = req.body.nom;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const mail = req.body.mail;
  userModel.create(mail, nom, prenom, pwd, 'candidat', tel, function (req, res2, next) {
    res.redirect('/login?notif=Votre compte a été créé');
})});

router.get('/logout',(req,res) => { 
  req.session.destroy(); 
  res.redirect('/');
});

module.exports = router;
