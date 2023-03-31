var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/userslist', function (req, res, next) { 
  result = userModel.readall(function(result){
    res.render('usersList', { title: 'List des utilisateurs', users: result });
  });
});

router.get('/userDetails', function (req, res, next) {
    result = userModel.read(req.query.id, function(result){
        res.render('userDetails', { title: 'Détails de l\'utilisateur', user: result });
    });
});

router.get('/organisationslist', function (req, res, next) {
    result = organisationModel.readall(function(result){
        res.render('organisationsList', { title: 'List des organisations', organisations: result });
    });
});


module.exports = router;
