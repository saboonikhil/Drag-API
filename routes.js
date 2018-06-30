const express = require('express');
const router = express.Router();


const user_controller = require('./controllers/userController');
const cab_controller = require('./controllers/cabController');
const driver_controller = require('./controllers/driverController');
const place_controller = require('./controllers/placeController');
const sub_place_controller = require('./controllers/subPlaceController');
const auth = require('./controllers/auth')


//Routes that can be accessed by anyone
router.post('/login',auth.login);


//Routes that can be accessed only by authenticated & authorised users
//User Routes
router.get('/api/v1/users', user_controller.user_list);
router.post('/api/v1/users', user_controller.create_user);
router.get('/api/v1/users/:uID', user_controller.user_detail);
router.put('/api/v1/users/:uID', user_controller.user_update);
router.delete('/api/v1/users/:uID', user_controller.user_delete);


//Route that can be accessed by authenticated users
//Cab Routes
router.get('/api/v1/cabs', cab_controller.cab_list);
router.post('/api/v1/cabs', cab_controller.add_cab);
router.get('/api/v1/cabs/:cID', cab_controller.cab_detail);
router.put('/api/v1/cabs/:cID', cab_controller.cab_update);
router.delete('/api/v1/cabs/:cID', cab_controller.cab_delete);

//Driver Routes-authentication and authorisation both required
router.get('/api/v1/drivers', driver_controller.list_driver);
router.post('/api/v1/drivers', driver_controller.add_driver);
router.get('/api/v1/drivers/:dID', driver_controller.driver_detail);
router.put('/api/v1/drivers/:dID', driver_controller.driver_update);
router.delete('/api/v1/drivers/:dID', driver_controller.driver_delete);


//Place Routes - authentication required
router.get('/api/v1/places', place_controller.list_place);
router.post('/api/v1/places', place_controller.add_place);
router.get('/api/v1/places/:pID', place_controller.place_detail);
router.put('/api/v1/places/:pID', place_controller.place_update);
router.delete('/api/v1/places/:pID', place_controller.place_delete);

//Sub Place Routes - authentication required
router.get('/api/v1/subPlaces', sub_place_controller.list_sub_place);
router.post('/api/v1/subPlaces', sub_place_controller.add_sub_place);
router.get('/api/v1/subPlaces/:sID', sub_place_controller.sub_place_detail);
router.put('/api/v1/subPlaces/:sID', sub_place_controller.sub_place_update);
router.delete('/api/v1/subPlaces/:sID', sub_place_controller.sub_place_delete);

module.exports = router;


