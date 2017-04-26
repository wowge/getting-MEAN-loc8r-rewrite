/**
 * Created by gechao on 09/02/2017.
 */
var request = require('request');
var apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://loc8r4u.herokuapp.com';
}

function _showError(req, res, status) {
    var title, content;
    if (status === 404){
        title = 'page not found';
        content = 'Looks like we can\'t find this page. Sorry!';
    }else {
        title = status +', something\'s gone wrong';
        content = 'Something\'s gone wrong';
    }
    res.render('generic-text', {
        title: title,
        content: content
    });
}
module.exports.about = function(req, res, next) {
    res.render('generic-text', {
        title: 'About loc8r',
        content: 'loc8r was created to help people find places to sit down and get a bit of work done. \n\ncopyright Charles shenzhen'
    });
};
module.exports.angularApp = function (req, res, next) {
    res.render('layout', {
        title: 'loc8r'
    });
};

module.exports.register = function (req, res) {
    res.render('register', {
        title: 'Register in loc8r',
        pageheader: {
            title: 'Create a new loc8r account'
        },
        err: req.query.err
    });
};
module.exports.doRegister = function (req, res) {
   var postData, path, requestOptions;
   postData = {
        name: req.body.name,
       email: req.body.email,
       password: req.body.passw,
       lat: req.cookies.loc8r_lat,
       lng: req.cookies.loc8r_lng
   };
   path = '/api/register';
   requestOptions = { 
       url: apiOptions.server + path,
       method: 'post',
       json: postData
   };
   if (!postData.name || !postData.email || !postData.password){
       res.redirect('/register' + '?err=val');
   }else {
       request(requestOptions, function (err, response, body) {
           if (response.statusCode === 201){
               //console.log(body);
               res
                   //.cookie('loc8r_token', body.token,{httpOnly:false, secure:false})
                   .cookie('loc8r_token', body.token,{httpOnly:true, secure:true})
                   .cookie('loc8r_user', body.user)
                   .cookie('loc8r_email', body.email)
                   .redirect(req.query.lastPage ? req.query.lastPage : '/');
           }else if (response.statusCode === 400 && body.name && body.name === 'ValidationError'){
               res.redirect('/register' + '?err=val');
           }else {
               console.log(body);
               _showError(req, res, response.statusCode);
           }
       });
   }
};

module.exports.login = function (req, res) {
    res.render('login', {
        title: 'Login in loc8r',
        pageheader: {
            title: 'Login with your account'
        },
        err: req.query.err
    });
};

module.exports.doLogin = function (req, res) {
    var postData, path, requestOptions;
    postData = {
        //name: req.body.name,
        email: req.body.email,
        password: req.body.passw
    };
    path = '/api/login';
    requestOptions = {
        url: apiOptions.server + path,
        method: 'post',
        json: postData
    };
    if (!postData.email || !postData.password){
        res.redirect('/register' + '?err=val');
    }else {
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201){
                //console.log(body);
                res
                    //.cookie('loc8r_token',body.token,{httpOnly:false, secure:false})
                    .cookie('loc8r_token',body.token,{httpOnly:true, secure:true})
                    .cookie('loc8r_user', body.user)
                    .cookie('loc8r_email', body.email)
                    .redirect(req.query.lastPage ? req.query.lastPage : '/');
            }else if (response.statusCode === 400 && body.name && body.name === 'ValidationError'){
                res.redirect('/login' + '?err=val');
            }else {
                console.log(body);
                _showError(req, res, response.statusCode);
            }
        });
    }
};