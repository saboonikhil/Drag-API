const express = require('express');
const router = express.Router();
const User = require('./model').User;

router.param('uID', function(req, res, next, id) {
	User.find(id, function(err, user){
		if(err) return next(err);
		if(!user){
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = user;
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

router.get('/user/:uID', function(req, res) {
	res.json(req.user);
});

router.put('/user/:uID', function(req, res, next) {
	req.user.update(req.body, function(err,result) {
		if(err) return next(err);
		res.json(result);//check this
	});
});

router.delete('/user/:uID', (req,res) => {
	req.user.remove(function(err){		
			if(err) return next(err);
			res.json(user);		
	});
});

module.exports = router;


