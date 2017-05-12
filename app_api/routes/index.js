/**
 *
 */
/**
 *
 */
var express = require('express');
var router = express.Router();

var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

router.get('/locations', auth, ctrlLocations.locationsListByDistance);
router.post('/locations', auth, ctrlLocations.locationsCreate);
router.get('/locations/:locationid',ctrlLocations.locationsReadOne);
router.put('/locations/:locationid',ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid',ctrlLocations.locationsDeleteOne);

router.post('/locations/:locationid/reviews', auth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsDeleteOne);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;