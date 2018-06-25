const express = require('express');
const router = express.Router();
const user_controller = require('./controllers/userController');
const car_detail_controller = require('./controllers/carDetailController');
const driver_controller = require('./controllers/driverController');

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

//Driver Routes
router.get('/drivers', driver_controller.list_driver);

router.post('/drivers', driver_controller.add_driver);

router.get('/drivers/:dID', driver_controller.driver_detail);

router.put('/drivers/:dID', driver_controller.driver_update);

router.delete('/drivers/:dID', driver_controller.driver_delete);

module.exports = router;


