/**
 *
 */
var cbSuccess = function (position) {
    //console.log(position.coords.longitude, position.coords.latitude, '//lng lat');
    document.cookie = 'loc8r_lng=' + position.coords.longitude;
    document.cookie = 'loc8r_lat=' + position.coords.latitude;
};
var cbError = function (err) {
    document.cookie = 'loc8r_lng=0';
    document.cookie = 'loc8r_lat=0';
    console.log(err);
};
var geoOptions = {
    enableHighAccuracy: true
};
var watchId = navigator.geolocation.watchPosition(cbSuccess, cbError, geoOptions);

var account = (function () {
    if (document.cookie){
        //var result = /(\w+)\.(\w+)\.(\w+)/.exec(document.cookie);
        //var head = result[1];
        //var payload = result[2];
        var items, user, lng, lat;
        items = document.cookie.split(/\s*;\s*/);
        //console.log('cookies:', document.cookie);
        //console.log('items:', items);
        items.forEach(function (item) {
            item = item.split('=');
            if (item[0] === 'loc8r_user'){
                user = decodeURIComponent(item[1]);
            }else if (item[0] === 'loc8r_lng'){
                lng = item[1];
            }else if (item[0] === 'loc8r_lat'){
                lat = item[1];
            }
        });
        return {
            user: user,
            lng: lng,
            lat: lat
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
    if (account.user){
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