const User = require('../models/user').User;

exports.user_list = function(req, res) {
    User.find({}).sort({createdAt: -1}).exec(function(err,users){
		if(err) return next(err);
		res.json(users);
	});
};

exports.create_user = function(req,res) {
	const user = new User(req.body);
	user.save(function(err,user){
		if(err) return next(err);
		res.status(201);
		res.json(user);
	});
}

exports.user_detail = function(req, res) {
    res.json(req.user);
};

exports.user_update = function(req, res) {
    req.user.update(req.body, function(err, result) {
		if(err) return next(err);
		res.json(result);
	});
};

exports.user_delete = function(req, res) {
    req.user.remove(function(err,user){		
			if(err) return next(err);
			res.json(user);							
	});
};
