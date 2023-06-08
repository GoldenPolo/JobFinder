const express = require('express')

const offerModel = require('../model/offre')
const userModel = require('../model/utilisateur')

const router = express.Router()

router.get('/users', function (req, res, next) {
  userModel.readall(0, 10, function (result) {
    res.status(200).json(result)
  })
})

router.get('/offers', function (req, res, next) {
  offerModel.readAllDetailed(1, 10, function (result) {
    res.status(200).json(result)
  })
})

module.exports = router
