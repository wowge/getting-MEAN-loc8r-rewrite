/**
 * Created by gechao on 14/04/2017.
 */
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.register = function (req, res) {
    if (!req.body.name || !req.body.password || !req.body.email){
        sendJsonResponse(res, 400, {
            message: 'All fields required'
        });
        return;
    }
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        var token;
        if (err){
            sendJsonResponse(res, 404, err);
        }else {
            token = user.generateJwt();
            sendJsonResponse(res, 201, {
                'token': token,
                'user': user.name,
                'email': user.email
            });
        }
    });

};
module.exports.login = function (req, res) {
    if (!req.body.password || !req.body.email) {
        sendJsonResponse(res, 400, {
            message: 'All fields required'
        });
        return;
    }
    passport.authenticate('local', function (err, user, info) {
        var token;
        if (err){
            sendJsonResponse(res, 404, err);
            return;
        }
        if (user){
            token = user.generateJwt();
            sendJsonResponse(res, 201, {
                'token': token,
                'user': user.name,
                'email': user.email
            });
        }else {
            sendJsonResponse(res, 401, info);
        }
    })(req, res);
};