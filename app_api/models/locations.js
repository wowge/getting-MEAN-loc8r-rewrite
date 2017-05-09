/**
 * Created by gechao on 10/03/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var openingTimeSchema = new Schema({
    days: {type: String},
    opening: String,
    closing: String
    //closed: {type: Boolean}
},{_id: false});
var reviewSchema = new Schema({
    author: {type: String, required: true},
    rating: {type: Number, required: true, max: 5, min: 0},
    reviewText: {type: String, required: true},
    createOn: {type: Date, required: true}
});
var locationSchema = new Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, 'default': 0, min: 0, max: 5},
    facilities: {type: [String], required: true},
    coords: {type: [Number], index: '2dsphere', required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required:true},
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});
mongoose.model('Location',locationSchema);
