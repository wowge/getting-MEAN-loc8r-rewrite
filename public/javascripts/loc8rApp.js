/**
 * */

angular.module('loc8rApp', []);

var locationListCtrl = function ($scope, loc8rData, geoLocation) {
    $scope.message = 'Checking your location';
    $scope.getData = function (position) {
        var lng = position.coords.longitude,
            lat = position.coords.latitude;
        $scope.message = 'Searching for nearby places...';
        loc8rData.locationByCoords(lng, lat)
            .success(function (data) {
                $scope.message = data.length>0 ? '' : 'No location found';
                $scope.data ={
                    locations: data
                };
            })
            .error(function (e) {
                $scope.message = 'Something\'s gone wrong';
            });
    };
    $scope.showError = function (error) {
        $scope.$apply(function () {
            $scope.message = error.message;
        });
    };
    $scope.noGeo = function () {
        $scope.$apply(function () {
            $scope.message = 'Geolocation isn\'t supported by this browser';
        });
    };
    geoLocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};
var geoLocation = function () {
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        }else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition
    };
};

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
var formatDistance = function (){
    return function (distance) {
        var numDistance, unit;
        if (distance && _isNumeric(distance)){
            if (distance < 1000){
                numDistance = parseInt(distance, 10);
                unit = 'm';
            }else {
                numDistance = parseFloat(distance/1000).toFixed(2);
                unit = 'km';
            }
            return numDistance + unit;
        }else {
            return '?';
        }

    };
};
var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        //template: '{{thisRating}}'
        templateUrl: '/rating-stars.html'
    };
};
var loc8rData = function ($http) {
    var locationByCoords = function (lng, lat) {
        return $http.get('/api/locations/?lng=' + lng +'&lat=' + lat +'&maxDistance=10000');
    };
    return {
        locationByCoords: locationByCoords
    };
};

angular
    .module('loc8rApp')
    .controller('locationListCtrl',locationListCtrl)
    .filter('formatDistance',formatDistance)
    .directive('ratingStars',ratingStars)
    .service('loc8rData',loc8rData)
    .service('geoLocation',geoLocation);