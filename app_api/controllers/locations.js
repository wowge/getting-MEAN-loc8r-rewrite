/**
 * Created by gechao on 20/03/2017.
 */
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var User = mongoose.model('User');
/*var theEarth = (function () {
    var earthRadius = 6371;//unit:km
    var getDistanceFromRads = function (rads) {
        return parseFloat(earthRadius * rads);
    };
    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };
    return {
        getDistanceFromRads : getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance
    };
})();*/
var sendJasonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsListByDistance = function (req, res) {
    if (req.query.lng && req.query.lat){
        var lng = parseFloat(req.query.lng);
        var lat = parseFloat(req.query.lat);
    }else {
        sendJasonResponse(res, 404, {
            'message': 'lng or lat parameter is incorrect'
        });
        return;
    }
    if (req.payload && req.payload._id){
        User
            .findById(req.payload._id)
            .select('-hash -salt -email -name')
            .exec(function (err, user) {
                if (!user){
                    sendJasonResponse(res, 404, {
                        'message': 'User not found'
                    });
                    return;
                }else if(err){
                    sendJasonResponse(res, 400, err);
                    return;
                }
                user.coords = [lng, lat];
                user.latest = Date.now();
                user.save(function (err, user) {
                    if (err){
                        sendJasonResponse(res, 404, err);
                    }
                });
            });
    }

    //console.log('lng:', lng, 'lat:', lat);
    var point = {
        type : 'Point',
        coordinates : [lng, lat]
    };
    var geoOptions = {
        spherical : true,
        maxDistance : parseFloat(req.query.maxDistance),
        num : 10
    };
    if ((!lng && lng !== 0) || (!lat && lat !== 0)){
        sendJasonResponse(res, 404, {
            'message': 'lng or lat parameter is incorrect'
        });
        return;
    }

    Loc.geoNear(point, geoOptions, function (err, results, stats) {
        var Locations = [];
        if (err){
            //console.log(err);
            sendJasonResponse(res, 404, err);
        }else {
            results.forEach(function (doc) {
                Locations.push({
                    //distance : theEarth.getDistanceFromRads(doc.dis),
                    distance : doc.dis,
                    name : doc.obj.name,
                    address : doc.obj.address,
                    rating : doc.obj.rating,
                    facilities : doc.obj.facilities,
                    coords: doc.obj.coords,
                    _id : doc.obj._id
                });
            });
            console.log(Locations);
            sendJasonResponse(res, 200, Locations);
        }
    });
};
module.exports.locationsCreate = function (req, res) {
    Loc.create({
        name : req.body.name,
        address : req.body.address,
        facilities : req.body.facilities.split(','),
        //rating : req.body.rating,
        coords : [parseFloat(req.body.lng),parseFloat(req.body.lat)],
        openingTimes : [{
            days : req.body.days,
            opening : req.body.opening,
            closing : req.body.closing
            //closed : req.body.closed
        }],
        author: req.payload._id
    },function (err, location) {
        if (err){
            sendJasonResponse(res, 400, err);
        }else {
            User
                .findById(location.author)
                .select('-hash -salt -email -name -coords -latest')
                .exec(function (err, user) {
                    if (!user){
                        sendJasonResponse(res, 404, {
                            'message': 'User not found'
                        });
                        return;
                    }else if (err){
                        sendJasonResponse(res, 400, err);
                        return;
                    }
                    user.createdLocations.push(location._id);
                    user.save(function (err, user) {
                        if (err){
                            sendJasonResponse(res, 404, err);
                        }
                    });
                });
            sendJasonResponse(res, 201, location);
        }
    })
};
module.exports.locationsReadOne = function (req, res) {
    if(req.params && req.params.locationid){
        Loc
            .findById(req.params.locationid)
            .populate('author', 'name')
            .exec(function (err,location) {
                if (!location){
                    sendJasonResponse(res, 404, {
                        'message' : 'locationid not found'
                    });
                    return;
                }else if (err){
                    sendJasonResponse(res, 404, err);
                    return;
                }
                //console.log(location);
                sendJasonResponse(res, 200, location);

            });
    }else {
        sendJasonResponse(res, 404, {
            'message' : 'no locationid in request'
        });
    }
};
module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid){
        sendJasonResponse(res, 404, {
            'message' : 'locationid is required'
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('-rating -reviews')
        .exec(function (err, location) {
            if (!location){
                sendJasonResponse(res, 404, {
                    'message' : 'locationid not found'
                });
                return;
            }else if (err){
                sendJasonResponse(res, 400, err);
            }
            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
            location.openingTimes = [{
                days : req.body.days1,
                opening : req.body.opening1,
                closing : req.body.closing1,
                closed : req.body.closed1
            },{
                days : req.body.days2,
                opening : req.body.opening2,
                closing : req.body.closing2,
                closed : req.body.closed2
            }];
            location.save(function (err, location) {
                if (err){
                    sendJasonResponse(res, 404, err);
                }else {
                    sendJasonResponse(res, 200, location);
                }
            })

        })
};
module.exports.locationsDeleteOne = function (req, res) {
    var locationid = req.params.locationid;
    if (!locationid){
        sendJasonResponse(res, 404, {
            'message' : 'locationid is required'
        });
        return;
    }
    Loc
        .findByIdAndRemove(locationid)
        .exec(function (err, location) {
            if (err){
                sendJasonResponse(res, 404, err);
            }else {
                sendJasonResponse(res, 204, null);
            }
        });
};

