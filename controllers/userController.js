const User = require('../models/user').User;
const async = require('async');

/*router.param('uID', function(req, res, next, id) {
	User.findById(id, function(err,doc){
		if(err) return next(err);
		if(!doc){
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = doc;
		return next();
	});
});*/

exports.user_list = function(req, res, next) {
	User.find({}).sort({createdAt: -1}).exec(function(err,users){
		if(err) return next(err);
		res.json(users);
	});
};

exports.create_user = function(req, res, next) {
	const user = new User(req.body);
	user.save(function(err,user){
		if(err) return next(err);
		res.status(201);
		res.json(user);
	});
};

exports.user_detail = function(req, res, next) {
	User.findById(req.params.uID, function(err, result){
		if(err) return next(err);
		if(!result){
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = result;
		res.json(req.user);
	});
};

exports.user_update = function(req, res, next) {
	User.findById(req.params.uID, function(err, result){
		if(err) return next(err);
		if(!result){
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = result;
		req.user.update(req.body, function(err, result) {
			if(err) return next(err);
			res.json(result);
		});
	});
};

exports.user_delete = function(req, res, next) {
	User.remove({ _id: req.params.uID}, function(err,user){		
		if(err) return next(err);
		res.json(user);							
	});
};
