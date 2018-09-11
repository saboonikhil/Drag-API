const express = require('express');
const router = express.Router();


const user_controller = require('./controllers/userController');
const cab_controller = require('./controllers/cabController');
const driver_controller = require('./controllers/driverController');
const place_controller = require('./controllers/placeController');
const sub_place_controller = require('./controllers/subPlaceController');
const auth = require('./controllers/auth');


//Routes that can be accessed by anyone
router.post('/signin',auth.signin);


//Routes that can be accessed only by authenticated & authorised users
//User Routes
router.get('/users', user_controller.user_list);
router.post('/signup', user_controller.create_user);
router.get('/users/:uID', user_controller.user_detail);
router.put('/users/:uID', user_controller.user_update);
router.delete('/users/:uID', user_controller.user_delete);
router.put('/users/:uID/bookCab', user_controller.user_book_cab);


//Route that can be accessed by authenticated users
//Cab Routes
router.get('/cabs', cab_controller.cab_list);
router.post('/cabs', cab_controller.add_cab);
router.get('/cabs/:cID', cab_controller.cab_detail);
router.put('/cabs/:cID', cab_controller.cab_update);
router.delete('/cabs/:cID', cab_controller.cab_delete);

//Driver Routes-authentication and authorisation both required
router.get('/drivers', driver_controller.list_driver);
router.post('/drivers', driver_controller.add_driver);
router.get('/drivers/:dID', driver_controller.driver_detail);
router.put('/drivers/:dID', driver_controller.driver_update);
router.delete('/drivers/:dID', driver_controller.driver_delete);


//Place Routes - authentication required
router.get('/places', place_controller.list_place);
router.post('/places', place_controller.add_place);
router.get('/places/:pID', place_controller.place_detail);
router.put('/places/:pID', place_controller.place_update);
router.delete('/places/:pID', place_controller.place_delete);

//Sub Place Routes - authentication required
router.get('/subPlaces', sub_place_controller.list_sub_place);
router.post('/subPlaces', sub_place_controller.add_sub_place);
router.get('/subPlaces/:sID', sub_place_controller.sub_place_detail);
router.put('/subPlaces/:sID', sub_place_controller.sub_place_update);
router.delete('/subPlaces/:sID', sub_place_controller.sub_place_delete);

module.exports = router;


