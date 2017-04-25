/**
 * Created by gechao on 20/03/2017.
 */
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var User = mongoose.model('User');
var sendJasonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
var getAuthor = function (req, res, callback) {
    if (req.payload || req.payload.email){
        User
            .findOne({email: req.payload.email})
            .exec(function (err, user) {
                if (!user){
                    sendJasonResponse(res, 404, {
                        'message': 'No user found'
                    });
                    return;
                }else if (err){
                    sendJasonResponse(res, 404, err);
                    return;
                }else {
                    callback(req, res, user.name);
                }
            });
    }else {
        sendJasonResponse(res, 404, {
            'message': 'No user found'
        });
        return;
    }
};
var updateAverageRating = function (locationid) {
    Loc
        .findById(locationid)
        .select('rating, reviews')
        .exec(function (err,location) {
            if (!err){
                doSetAverageRating(location);
            }
        });
};
var doSetAverageRating =function (location) {
    var ratingTotal = 0, ratingAverage, ratingCount = location.reviews.length;
    if (location.reviews && location.reviews.length > 0) {
        for (var i = 0; i < ratingCount; i++) {
            ratingTotal += location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / ratingCount, 10);
        location.rating = ratingAverage;
        location
            .save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Reriew rating updated to', ratingAverage);
                }
            });
    }
};
var doAddReview = function (req, res, location, author) {
    if (!location){
        sendJasonResponse(res, 400, {
            'message' : 'location not found'
        });
        return;
    }
    location.reviews.push({
        //author : req.body.author,
        author: author,
        rating : req.body.rating,
        reviewText : req.body.reviewText
    });
    location.save(function (err, location) {
        var thisReview;
        if (err){
            sendJasonResponse(res, 400, err);
        }else {
            updateAverageRating(location._id);
            thisReview = location.reviews[location.reviews.length-1];
            sendJasonResponse(res, 201, thisReview);
        }
    });
};
module.exports.reviewsCreate = function (req, res) {
    getAuthor(req, res, function (req, res, userName) {
        var locationid = req.params.locationid;
        if (locationid){
            Loc
                .findById(locationid)
                .select('reviews')
                .exec(function (err, location) {
                    if (err){
                        sendJasonResponse(res, 400, err);
                    }else {
                        doAddReview(req, res, location, userName);
                    }
                });
        }else {
            sendJasonResponse(res, 400, {
                'message' : 'Not found, locationid required'
            });
        }
    });
};
module.exports.reviewsReadOne = function (req, res) {
    if(req.params && req.params.locationid && req.params.reviewid){
        Loc
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(function (err,location) {
                var response, review;
                if (!location){
                    sendJasonResponse(res, 404, {
                        'message' : 'locationid not found'
                    });
                    return;
                }else if (err){
                    sendJasonResponse(res, 404, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0){
                    review = location.reviews.id(req.params.reviewid);
                    if (!review){
                        sendJasonResponse(res, 404, {
                            'message' : 'reviewid not found'
                            //'review':location.reviews
                        });
                    }else {
                        response = {
                            location : {
                                id : req.params.locationid,
                                name : location.name
                            },
                            review : review
                        };
                        sendJasonResponse(res, 200, response);
                    }
                }else {
                    sendJasonResponse(res, 404, {
                        'message' : 'no reviews found'
                    });
                }

            });
    }else {
        sendJasonResponse(res, 404, {
            'message' : 'locationid and reviewid are both required'
        });
    }
};
module.exports.reviewsUpdateOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid){
        sendJasonResponse(res, 404, {
            'message' : 'locationid and reviewid are both required'
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(
            function (err, location) {
            var thisReview;
            if (!location){
                sendJasonResponse(res, 404, {
                    'message' : 'location not found'
                });
                return;
            }else if (err){
                sendJasonResponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0){
                thisReview = location.reviews.id(req.params.reviewid);
                if (!thisReview){
                    sendJasonResponse(res, 404, {
                        'message' : 'reviewid not found'
                    });
                    return;
                }
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;
                location.save(function (err, location) {
                    if (err){
                        sendJasonResponse(res, 404, err);
                    }else {
                        updateAverageRating(location._id);
                        sendJasonResponse(res, 200, location);
                    }
                });
            }else {
                sendJasonResponse(res, 404, {
                    'message' : 'no review to update'
                });
            }
        });
};
module.exports.reviewsDeleteOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid){
        sendJasonResponse(res, 404, {
            'message' : 'locationid and reviewid are both required'
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function (err, location) {
            if (!location){
                sendJasonResponse(res, 404, {
                    'message' : 'locationid not found'
                });
                return;
            }else if (err){
                sendJasonResponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0){
                if (!location.reviews.id(req.params.reviewid)){
                    sendJasonResponse(res, 404, {
                        'message' : 'reviewid not found'
                    });
                }else {
                    location.reviews.id(req.params.reviewid).remove();
                    location.save(function (err) {
                        if (err){
                            sendJasonResponse(res, 404, err);
                        }else {
                            updateAverageRating(location._id);
                            sendJasonResponse(res, 204, null);
                        }
                    });
                }
            }else {
                sendJasonResponse(res, 404, {
                    'message' : 'no review to remove'
                });
            }
        });
};

