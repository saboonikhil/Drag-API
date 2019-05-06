const Location = require('../models/location').Location;
const async = require('async');

exports.list_location = function (req, res, next) {
	Location.find({}).sort({ createdAt: -1 }).exec(function (err, locations) {
		if (err) return next(err);
		res.json(locations);
	});
};

exports.add_location = function (req, res, next) {
	const location = new Location(req.body);
	location.save(function (err, location) {
		if (err) return next(err);
		res.status(201);
		res.json(location);
	});
};

exports.location_detail = function (req, res, next) {
	Location.findById(req.params.lID).exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load location');
			err.status = 404;
			return next(err);
		}
		req.location = result;
		res.json(req.location);
	});
};

exports.location_update = function (req, res, next) {
	Location.findById(req.params.lID).exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load location');
			err.status = 404;
			return next(err);
		}
		req.location = result;
		req.location.update(req.body, function (err, result) {
			if (err) return next(err);
			res.json(result);
		});
	});
};

exports.add_sub_location = function (req, res, next) {
	Location.findById(req.params.lID).exec(function (err, location) {
		if (err) return next(err);
		if (!location) {
			err = new Error('Failed to load location');
			err.status = 404;
			return next(err);
		}
		var flag = false;
		if (typeOf(req.body.setA) !== 'undefined' && req.body.setA !== null) {
			location.setA.push(req.body.setA);
			flag = true;
		}
		if (typeOf(req.body.setB) !== 'undefined' && req.body.setB !== null) {
			location.setB.push(req.body.setB);
			flag = true;
		}
		if (flag == true) {
			location.save(function (err) {
				if (err) return next(err);
				res.json(location);
			});
		}
	});
};

exports.location_delete = function (req, res, next) {
	Location.remove({ _id: req.params.lID }, function (err, location) {
		if (err) return next(err);
		res.json(location);
	});
};
