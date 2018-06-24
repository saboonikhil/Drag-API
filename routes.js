const express = require('express');
const router = express.Router();
const User = require('./models/user').User;
//const carDetail = require('./models/carDetail').CarDetail;
const car_details_controller = require('./controllers/carDetailsController');

//End Points for Users
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
	req.user.update(req.body, function(err, result) {
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

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/carDetails/create', car_details_controller.carDetail_create_get);

// POST request for creating Book.
router.post('/carDetails/create', car_details_controller.carDetail_create_post);

// GET request to delete Book.
router.get('/carDetails/:id/delete', car_details_controller.carDetail_delete_get);

// POST request to delete Book.
router.post('/carDetails/:id/delete', car_details_controller.carDetail_delete_post);

// GET request to update Book.
router.get('/carDetails/:id/update', car_details_controller.carDetail_update_get);

// POST request to update Book.
router.post('/carDetails/:id/update', car_details_controller.carDetail_update_post);

// GET request for one Book.
router.get('/carDetails/:id', car_details_controller.carDetail_detail);

// GET request for list of all Book items.
router.get('/carDetails', car_details_controller.carDetail_list);

module.exports = router;


