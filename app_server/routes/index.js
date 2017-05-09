var express = require('express');
var router = express.Router();
//var ctrlMain = require('../controllers/main');
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/*  Locations pages  */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid',ctrlLocations.locationInfo);
router.get('/new',ctrlLocations.addLocation);
router.post('/new', ctrlLocations.doAddLocation);
router.get('/location/:locationid/reviews/new', ctrlLocations.addReview);
router.post('/location/:locationid/reviews/new', ctrlLocations.doAddReview);
//router.get('/test',ctrlLocations.test);

/*  Others page  */
router.get('/about',ctrlOthers.about);
router.get('/register', ctrlOthers.register);
router.post('/register', ctrlOthers.doRegister);
router.get('/login', ctrlOthers.login);
router.post('/login', ctrlOthers.doLogin);
router.get('/logout', function (req, res) {
    res.clearCookie('loc8r_token');
    res.clearCookie('loc8r_user');
    res.clearCookie('loc8r_email');
    res.redirect(req.query.lastPage ? req.query.lastPage : '/');
});

/* GET home page. */

//router.get('/', ctrlMain.routes);

module.exports = router;
