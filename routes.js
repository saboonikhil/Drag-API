const express = require('express');
const router = express.Router();
const car_detail_controller = require('./controllers/carDetailController');
const user_controller = require('./controllers/userController');

//User Routes
router.get('/users', user_controller.user_list);

router.post('/users', user_controller.create_user);

router.get('/users/:uID', user_controller.user_detail);

router.put('/users/:uID', user_controller.user_update);

router.delete('/users/:uID', user_controller.user_delete);

//Car Detail Routes
router.get('/carDetails', car_detail_controller.carDetail_list);

router.post('/carDetails', car_detail_controller.add_car_detail);

router.get('/carDetails/:cID', car_detail_controller.car_detail);

router.put('/carDetails/:cID', car_detail_controller.car_update);

router.delete('/carDetails/:cID', car_detail_controller.car_delete);

module.exports = router;


