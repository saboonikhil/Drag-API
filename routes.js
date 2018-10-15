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


//Routes that can be accessed only by authenticated users
//User Routes
router.get('/api/users', user_controller.user_list);
//Routes that can be accessed by anyone
router.post('/signup', user_controller.create_user);
router.get('/api/users/:uID', user_controller.user_detail);
router.put('/api/users/:uID', user_controller.user_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/users/:uID', user_controller.user_delete);
//Routes that can be accessed only by authenticated users
router.put('/api/users/:uID/bookCab', user_controller.user_book_cab);


//Route that can be accessed by authenticated users
//Cab Routes
router.get('/api/cabs', cab_controller.cab_list);
router.put('/api/places/:pID', place_controller.place_update);
//Routes-authentication and authorisation both required
router.post('/api/admin/cabs', cab_controller.add_cab);

router.get('/api/cabs/:cID', cab_controller.cab_detail);
router.put('/cabs/:cID', cab_controller.cab_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/cabs/:cID', cab_controller.cab_delete);


//Driver Routes-authentication and authorisation both required
router.get('/api/drivers', driver_controller.list_driver);
router.put('/api/places/:pID', place_controller.place_update);
//Routes-authentication and authorisation both required
router.post('/api/admin/drivers', driver_controller.add_driver);
//Driver Routes-authentication and authorisation both required
router.get('/api/drivers/:dID', driver_controller.driver_detail);
router.put('/api/drivers/:dID', driver_controller.driver_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/drivers/:dID', driver_controller.driver_delete);


//Place Routes - authentication required
router.get('/api/places', place_controller.list_place);
router.put('/api/places/:pID', place_controller.place_update);
//Routes-authentication and authorisation both required
router.post('/api/admin/places', place_controller.add_place);

router.get('/api/places/:pID', place_controller.place_detail);
router.put('/api/places/:pID', place_controller.place_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/places/:pID', place_controller.place_delete);


//Sub Place Routes - authentication required
router.get('/api/subPlaces', sub_place_controller.list_sub_place);
router.put('/api/places/:pID', place_controller.place_update);
//Routes-authentication and authorisation both required
router.post('/api/admin/subPlaces', sub_place_controller.add_sub_place);
router.get('/api/subPlaces/:sID', sub_place_controller.sub_place_detail);
router.put('/api/subPlaces/:sID', sub_place_controller.sub_place_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/subPlaces/:sID', sub_place_controller.sub_place_delete);

module.exports = router;


