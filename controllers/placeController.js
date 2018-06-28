const Place = require('../models/place').Place;
const async = require('async');

exports.list_place = function(req, res, next) {
	Place.find({}).sort({createdAt: -1}).populate('subPlace').exec(function(err,places){
		if(err) return next(err);
		res.json(places);
	});
};

exports.add_place = function(req, res, next) {
	const place = new Place(req.body);
	place.populate('subPlace').save(function(err,place){
		if(err) return next(err);
		res.status(201);
		res.json(place);
	});
};

exports.place_detail = function(req, res, next) {
	Place.findById(req.params.pID).populate('subPlace').exec(function(err, result){
		if(err) return next(err);
		if(!result){
			err = new Error('Failed to load place');
			err.status = 404;
			return next(err);
		}
		req.place = result;
		res.json(req.place);
	});
};

exports.place_update = function(req, res, next) {
	Place.findById(req.params.pID).populate('subPlace').exec(function(err, result){
		if(err) return next(err);
		if(!result){
			err = new Error('Failed to load place');
			err.status = 404;
			return next(err);
		}
		req.place = result;   
		req.place.update(req.body, function(err, result) {
			if(err) return next(err);
			res.json(result);
		});
	});
};

exports.place_delete = function(req, res, next) {
	Place.remove({ _id: req.params.pID}, function(err,place){		
		if(err) return next(err);
		res.json(place);							
	});
};
