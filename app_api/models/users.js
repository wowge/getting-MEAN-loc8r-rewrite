/**
 * Created by gechao on 12/04/2017.
 */
var crypto = require('crypto');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var hashs = crypto.getHashes();
//console.log(hashs);
var userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    name: {
        required: true,
        type: String
    },
    coords: {
        required: true,
        type: [Number]
    },
    salt: String,
    hash: String
});
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'md5').toString('hex');
};
userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'md5').toString('hex');
    return this.hash === hash;
};
userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime()/1000)
    }, process.env.JWT_SECRET);
};
mongoose.model('User', userSchema);
