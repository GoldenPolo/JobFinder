const express = require('express')
const router = express.Router()
const userModel = require('../model/utilisateur')
const passModel = require('../model/pass')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('login')
})

router.get('/login', function (req, res, next) {
  let notif = req.query.notif
  if (!notif) {
    notif = false
  }
  res.render('login', {
    message: false,
    notif
  })
})

router.get('/successfulLogin', function (req, res, next) {
  console.log(req.query.type)
  req.session.userType = req.query.type
  if (req.query.type === 'candidat') {
    res.redirect('./candidat/offersList')
  } else if (req.query.type === 'recruteur') {
    userModel.readOrganisation(req.session.userid, function (result) {
      console.log(result)
      req.session.userorganisation = result[0].organisation
      res.redirect('./recruter/myOffersList')
    })
  } else if (req.query.type === 'admin') {
    res.redirect('./admin/usersList')
  } else {
    res.render('login', {
      message: 'Identifiants incorrects'
    })
  }
})

router.post('/login', (req, res) => {
  const username = req.body.email
  const password = req.body.pswd
  userModel.readPassword(username, function (result) {
    console.log(result.motDePasse)
    if (result) {
      passModel.comparePassword(password, result.motDePasse, function (result2) {
        if (result2) {
          const session = req.session
          session.useremail = req.body.username
          session.userid = result.id
          res.redirect('/successfulLogin?type=' + result.type)
        } else {
          return res.render('./login', {
            message: 'Identifiants incorrects',
            notif: false
          })
        }
      })
    } else {
      return res.render('./login', {
        message: 'Identifiants incorrects',
        notif: false
      })
    }
  })
})

router.get('/signup', function (req, res, next) {
  res.render('signup', { message: false })
})

router.post('/signup', function (req, res, next) {
  const prenom = req.body.prenom
  const nom = req.body.nom
  const pwd = req.body.pwd
  const tel = req.body.tel
  const mail = req.body.mail
  passModel.generateHash(pwd, function (result) {
    const hashPwd = result
    userModel.create(mail, nom, prenom, hashPwd, 'candidat', tel, function (req, res2, next) {
      console.log('EMAIL DE CONFIRMATION ENVOYÉ À ', mail)
      res.redirect('/login?notif=Votre compte a été créé')
    })
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login?notif=Vous avez été déconnecté')
})

module.exports = router
