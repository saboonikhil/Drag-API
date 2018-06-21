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

router.get('/', function(req, res, next) {
	User.find({}).sort({createdAt: -1}).exec(function(err,users){
		if(err) return next(err);
		res.json(users);
	});
});

router.post('/', function(req, res) {
	const user = new User(req.body);
	user.save(function(err,user){
		if(err) return next(err);
		res.status(201);
		res.json(user);
	});
});

router.get('/:uID', function(req, res) {
	res.json(req.user);
});

router.put('/:uID', function(req, res, next) {
	req.user.update(req.body, function(err,result) {
		if(err) return next(err);
		res.json(result);
	});
});

router.delete('/:uID', (req,res) => {
	req.user.remove(function(err){		
			if(err) return next(err);
			res.json(user);		
	});
});

module.exports = router;


