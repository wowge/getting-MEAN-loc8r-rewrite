/**
 * Created by gechao on 13/02/2017.
 */
/*  GET 'home' page  */
var request = require('request');
var apiOptions = {
    server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://loc8r4u.herokuapp.com';
}

//function renderHomepage(req, res, responseBody) {
function renderHomepage(req, res, responseBody) {
    /* comment out for using angular*/
    var message;
    if (!(responseBody instanceof Array)){
        message = 'API lookup error';
        responseBody = [];
    }else if (!responseBody.length){
        message = 'no place found nearby';
    }
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        sidebar: 'Looking for wifi and a seat? Let loc8r helps youto find places to work when out and about.',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find a place to work with wifi near you!'
        },
        /* comment out for using angular*/
        locations: responseBody,
        message: message
    });
}
function _formatDistance(distance) {
    var numDistance, unit;
    if (distance < 1000){
        numDistance = parseInt(distance, 10);
        unit = 'm';
    }else {
        numDistance = parseFloat(distance/1000).toFixed(2);
        unit = 'km';
    }
    return numDistance + unit;
}
function renderDetailPage(req, res, locDetail) {
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {
            title: locDetail.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locDetail
    });
}
function _showError(req, res, status) {
    var title, content;
    if (status === 404){
        title = 'page not found';
        content = 'Looks like we can\'t find this page. Sorry!';
    }else {
        title = status + ', something\'s gone wrong';
        content = 'Wooops, something\'s gone wrong';
    }
    res.render('generic-text', {
        title : title,
        content : content
    });
}
function renderReviewForm(req, res, locDetail) {
    res.render('location-review-form', {
        title: 'Review ' + locDetail.name + ' on loc8r',
        pageHeader: {
            title: 'Review ' + locDetail.name
        },
        err: req.query.err
        //url: req.originalUrl
    });
}
function getLocationInfo(req, res, callback) {
    var requestOptions, path;
    path = '/api/locations/' + req.params.locationid;
    requestOptions = {
        url : apiOptions.server + path,
        method : 'GET',
        json : {}
    };
    request(requestOptions,function (err, response, body) {
        var data = body;
        if (response.statusCode === 200){
            data.coords = {
                lng : body.coords[0],
                lat : body.coords[1]
            };
            callback(req, res, data);
        }else {
            _showError(req, res, response.statusCode);
        }

    });
}
/*request('http://www.baidu.com',function (err, response,body) {
    console.log('error', err);
    console.log('response and statusCode', response && response.statusCode);
    console.log('body', body);
});*/
module.exports.homelist = function (req, res) {
    /* comment out as using angular*/
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url : apiOptions.server + path,
        method : 'GET',
        json : {},
        qs : {
            lng : 113.9737819,
            lat : 22.5917434,
            //lng: 0,
            //lat: 0,
            maxDistance : 10000
        }
    };
    request(requestOptions, function (err, response, body) {
        var data;
        data = body;
        if (response.statusCode === 200 && data.length > 0){
            for (var i = 0; i < data.length; i ++){
                data[i].distance = _formatDistance(data[i].distance);
            }
        }
        renderHomepage(req, res, data);

    //renderHomepage(req, res);//using angular
     });
};

/*  GET 'Location info' page  */
module.exports.locationInfo = function (req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

/*  GET 'Add review' page  */
module.exports.addReview = function (req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};
module.exports.doAddReview = function (req, res) {
    var locationid, postData, path, requestOptions;
    locationid = req.params.locationid;
    postData = {
        author : req.body.name,
        rating : parseInt(req.body.rating, 10),
        reviewText : req.body.review
    };
    path = '/api/locations/' + locationid +'/reviews';
    requestOptions = {
        url : apiOptions.server + path,
        method : 'post',
        json : postData,
        headers: {
            Authorization: 'Bearer ' + req.cookies.loc8r_token
        }
    };
    if (!postData.rating || !postData.reviewText){
        res.redirect('/location/' + locationid +'/reviews/new?err=val');
    }else {
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201){
                res.redirect('/location/' + locationid);
            }else if (response.statusCode === 400 && body.name && body.name === 'ValidationError'){
                res.redirect('/location/' + locationid +'/reviews/new?err=val');
            }else if (response.statusCode === 401){
                res.redirect('/login?err=auth');
            }else {
                console.log(body);
                _showError(req, res, response.statusCode);
            }
        });
    }

};

/*  GET 'Test' page  */
module.exports.test = function (req,res) {
    res.render('test',{title: 'test'});
};