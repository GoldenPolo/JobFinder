var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var userModel = require('../model/utilisateur');
var offerModel = require('../model/offre');
var candidatureModel = require('../model/candidature');
var demAjoutOrgaModel = require('../model/demandeAjoutOrganisation');
var router = express.Router();
const moment = require('moment');
require('moment/locale/fr.js');
moment.locale('fr');
const paginateInfo = require('paginate-info');
const organisation = require('../model/organisation');


function requireRecruteur(req, res, next) {
  if (req.session && req.session.userType === 'recruteur') {
    return next();
  } else {
    res.redirect('/login');
  }
}

/* GET users listing. */
router.get('/', requireRecruteur, function(req, res, next) {
  res.redirect('/myOffersList');
});

router.get('/myOffersList', requireRecruteur, function (req, res, next) { 
  let currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  let startIndex = (currentPage - 1) * perPage;
  let query = req.query.q; // Récupère le paramètre "q" de l'URL
  let statusFilter = req.query.statusFilter;
  let notif = req.query.notif;

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
    statusFilter = 'publiee';
  }
  if (!notif) {
    notif = false;
  }

  offerModel.readOffresOrganisationFilters(req.session.userorganisation, query, statusFilter, startIndex, perPage, function(result) {
    const numOffers = result.length; // nombre total d'offres
    let totalPages = Math.ceil(numOffers / perPage); // nombre total de pages
    const pages = []; // tableau des numéros de page
    let notif = req.query.notif
    if (totalPages == 0) {
      totalPages = 1;
    }
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    if (query == '%') {
      query = '';
    }
    if (!notif){
      notif = false;
    }
    res.render('./recruter/myOffersList', { 
      title: 'Mes offres', 
      offers: result,
      paginationInfo: {
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalPages: totalPages,
        pages: pages
      },
      moment: moment,
      query: query,
      statusFilter: statusFilter,
      notif: notif
    });
  });
});

router.get('/myOfferDetails', requireRecruteur, function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    console.log(result);
    res.render('./recruter/myOfferDetails', { title: 'Détails de l\'offre', offer: result, id : req.query.id, moment: moment });
  });
});

router.get('/myOfferModif', requireRecruteur, function (req, res, next) { 
  result = offerModel.read(req.query.id, function(result){
    res.render('./recruter/myOfferModif', { title: 'Modification de l\'offre', offer: result, id : req.query.id, moment : moment });
  });
});

router.post('/myOfferModified', requireRecruteur, function (req, res, next) {
  const dateVal = req.body.dateValidite;
  const nbPiecesDem = req.body.nbPiecesDem;
  const indications = req.body.indications;
  offerModel.update(req.query.id, dateVal, indications, nbPiecesDem, function (resultat) {
    res.redirect("/recruter/myOffersList?notif=Votre offre a été mise à jour");
  });
});

router.get('/applicationsList', requireRecruteur, function (req, res, next) {
  let notif = req.query.notif
  if (!notif){
    notif = false;
  }
  if (req.query.id == null){
    result = candidatureModel.readCandidaturesToAllMyOffres(req.session.userorganisation, function(result){
      console.log(result);
      res.render('./recruter/applicationsList', { 
        title: 'Candidatures', 
        applications: result, 
        moment: moment, 
        notif: notif
      });
    });
  }
  else {
    result = candidatureModel.readCandidaturesToMyOffer(req.query.id, function(result){
      console.log(result);
      res.render('./recruter/applicationsList', { 
        title: 'Candidatures', 
        applications: result, 
        moment: moment, 
        notif: notif});
    });
  }
});

router.get('/download', requireRecruteur, function (req, res, next) {
  const dirPath = path.resolve(__dirname, '../public/uploads');
  let files = fs.readdirSync(dirPath).filter(file => file.startsWith(req.query.piecesDoss));
  const zip = new AdmZip();
  files.forEach((file => {
    zip.addLocalFile(dirPath+'\\'+file);
  }));
  const downloadName = req.query.prenom+'_'+req.query.nom+'.zip';
  const data = zip.toBuffer();
  res.set('Content-Type','application/octet-stream');
  res.set('Content-Disposition',`attachment; filename=${downloadName}`);
  res.set('Content-Length',data.length);
  res.send(data);
});

router.get('/addRecruter', requireRecruteur, function (req, res, next) {
  let notif = req.query.notif
  if (!notif){
    notif = false
  }
  demAjoutOrgaModel.read(req.session.userorganisation, function(resultat){
    res.render('./recruter/addRecruter', { 
      demandes : resultat ,
      notif : notif
    });
  });
});

router.get('/acceptRecruter', requireRecruteur, function (req, res, next) {
  userModel.becomeRecruter(req.query.id, req.session.userorganisation, function(resultat){
    demAjoutOrgaModel.delete(req.query.id, req.session.userorganisation, function(resultat){
      res.redirect('/recruter/addRecruter?notif=La demande a été acceptée');
    })
  });
});

router.get('/refuseRecruter', requireRecruteur, function (req, res, next) {
  demAjoutOrgaModel.delete(req.query.id, req.session.userorganisation, function(resultat){
    res.redirect('/recruter/addRecruter?notif=La demande a été refusée');
  });
});

router.get('/addOffre', requireRecruteur, function (req, res, next) {
  res.render('./candidat/addOffre', { title: 'Ajouter une offre' });
});

router.post('/newOffer', requireRecruteur, function (req, res, next) {
  const dateValid = req.body.dateValid;
  const indic = req.body.indic;
  const nbPieces = req.body.nbPieces;
  //comment récupérer fichePoste et organisation?
  offerModel.create(etat, dateValid, indic, nbPieces, fichePoste, organisation, function (req, res, next) {
   res.redirect('/myOffersList');
 })});

module.exports = router;
