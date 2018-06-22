const express = require('express');
const router = express.Router();
const User = require('./model').User;

router.param('uID', function(req, res, next, id) {
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
});

router.get('/users', function(req, res, next) {
	User.find({}).sort({createdAt: -1}).exec(function(err,users){
		if(err) return next(err);
		res.json(users);
	});
});

router.post('/users', function(req, res) {
	const user = new User(req.body);
	user.save(function(err,user){
		if(err) return next(err);
		res.status(201);
		res.json(user);
	});
});

router.get('/users/:uID', function(req, res) {
	res.json(req.user);
});

router.put('/users/:uID', function(req, res, next) {
	User.findByIdAndUpdate(req.params.uID, req.body, function(err, result) {
		if(err) return next(err);
		res.json(result);
	});
});

router.delete('/users/:uID', function(req,res) {
	req.user.remove(function(err,user){		
			if(err) return next(err);
			res.json(user);							
	});
});

module.exports = router;


