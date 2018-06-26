const SubPlace = require('../models/subPlace').SubPlace;
const async = require('async');

exports.list_sub_place = function(req, res, next) {
	SubPlace.find({}).sort({createdAt: -1}).exec(function(err,subPlaces){
		if(err) return next(err);
		res.json(subPlaces);
	});
};

exports.add_sub_place = function(req, res, next) {
	const subPlace = new SubPlace(req.body);
	subPlace.save(function(err,subPlace){
		if(err) return next(err);
		res.status(201);
		res.json(subPlace);
	});
};

exports.sub_place_detail = function(req, res, next) {
	SubPlace.findById(req.params.sID, function(err, result){
		if(err) return next(err);
		if(!result){
			err = new Error('Failed to load sub place');
			err.status = 404;
			return next(err);
		}
		req.subPlace = result;
		res.json(req.subPlace);
	});
};

exports.sub_place_update = function(req, res, next) {
	SubPlace.findById(req.params.sID, function(err, result){
		if(err) return next(err);
		if(!result){
			err = new Error('Failed to load sub place');
			err.status = 404;
			return next(err);
		}
		req.subPlace = result;		
		req.subPlace.update(req.body, function(err, result) {
			if(err) return next(err);
			res.json(result);
		});
	});
};

exports.sub_place_delete = function(req, res, next) {
	SubPlace.remove({_id: req.params.sID}, function(err,subPlace){		
		if(err) return next(err);
		res.json(subPlace);							
	});
};
