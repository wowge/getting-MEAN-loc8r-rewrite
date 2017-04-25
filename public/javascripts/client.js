/**
 * Created by gechao on 20/04/2017.
 */
var account = (function () {
    if (document.cookie){
        //var result = /(\w+)\.(\w+)\.(\w+)/.exec(document.cookie);
        //var head = result[1];
        //var payload = result[2];
        var docs, user, email;
        docs = document.cookie.split(/\s*;\s*/);
        //console.log('cookies:', document.cookie);
        //console.log('docs:', docs);
        docs.forEach(function (doc) {
            doc = doc.split('=');
            if (doc[0] === 'loc8r_user'){
                user = decodeURIComponent(doc[1]);
            }else if (doc[0] === 'loc8r_email'){
                email = decodeURIComponent(doc[1]);
            }
        });
        return {
            user: user,
            email: email
        };
    }else {
        return{};
    }
})();
var logout = function () {

};
var isLoggedIn = function () {
    /*var payload;
    if (token.payload){
        payload = JSON.parse(window.atob(token.payload));
        return payload.exp > Date.now()/1000;
    }else {
        return false;
    }*/
    if (account.user && account.email){
        return true;
    }else {
        return false;
    }
};
/*var currentUser = (function () {
    var payload;
    if (isLoggedIn()){
        payload = JSON.parse(window.atob(token.payload));
        return {
            name: payload.name,
            email: payload.email
        };
    }
})();*/