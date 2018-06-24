const express = require('express');
const router = express.Router();
const car_details_controller = require('./controllers/carDetailsController');
const user_controller = require('./controllers/userController');

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

//User Routes
router.get('/users', user_controller.user_list);

router.post('/users', user_controller.create_user);

router.get('/users/:uID', user_controller.user_detail);

router.put('/users/:uID', user_controller.user_update);

router.delete('/users/:uID', user_controller.user_delete);


router.get('/carDetails/create', car_details_controller.carDetail_create_get);


router.post('/carDetails/create', car_details_controller.carDetail_create_post);


router.get('/carDetails/:id/delete', car_details_controller.carDetail_delete_get);

router.post('/carDetails/:id/delete', car_details_controller.carDetail_delete_post);


router.get('/carDetails/:id/update', car_details_controller.carDetail_update_get);

router.post('/carDetails/:id/update', car_details_controller.carDetail_update_post);

router.get('/carDetails/:id', car_details_controller.carDetail_detail);


router.get('/carDetails', car_details_controller.carDetail_list);

module.exports = router;


