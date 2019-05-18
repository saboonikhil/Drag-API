const express = require('express');
const router = express.Router();


const user_controller = require('./controllers/userController');
const cab_controller = require('./controllers/cabController');
const partner_controller = require('./controllers/partnerController');
const location_controller = require('./controllers/locationController');
const payment_controller = require('./controllers/paymentController')
const auth = require('./controllers/auth');


//Routes that can be accessed by anyone
router.post('/signin', auth.signin);


//Routes that can be accessed only by authenticated users
//User Routes
router.get('/api/admin/users', user_controller.user_list);
//Routes that can be accessed by anyone
router.post('/signup', user_controller.create_user);
router.get('/api/users/:uID', user_controller.user_detail);
router.put('/api/users/:uID', user_controller.user_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/users/:uID', user_controller.user_delete);


//Route that can be accessed by authenticated users
//Cab Routes
router.get('/api/cabs', cab_controller.available_cab_list);
router.get('/api/admin/cabs', cab_controller.all_cab_list);
//Routes-authentication and authorisation both required
router.post('/api/admin/:pID/cabs', cab_controller.add_cab);

router.get('/api/cabs/:cID', cab_controller.cab_detail);
router.put('/cabs/:cID', cab_controller.cab_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/cabs/:cID', cab_controller.cab_delete);
router.get('/api/cabs/:cID/checkCab', cab_controller.cab_check_available);


//partner Routes-authentication and authorisation both required
router.get('/api/admin/partners', partner_controller.list_partner);

//Routes-authentication and authorisation both required - Admin Signup
router.post('/api/admin/signup', partner_controller.add_partner);
//partner Routes-authentication and authorisation both required
router.get('/api/admin/partners/:dID', partner_controller.partner_detail);
router.put('/api/admin/partners/:dID', partner_controller.partner_update);
//Routes-authentication and authorisation both required
router.delete('/api/admin/partners/:dID', partner_controller.partner_delete);


//Location Routes - authentication required
//router.get('/api/locations', location_controller.list_place);
//Routes-authentication and authorisation both required
router.get('/locations', location_controller.list_location);
router.post('/api/admin/locations', location_controller.add_location);

router.get('/api/locations/:lID', location_controller.location_detail);
router.put('/api/admin/locations/:lID', location_controller.location_update);
//Add Sub Location
router.put('/api/admin/locations/:lID/addSubLocation', location_controller.add_sub_location);
//Routes-authentication and authorisation both required
router.delete('/api/admin/locations/:lID', location_controller.location_delete);

router.post('/api/users/:uID/generateChecksum', payment_controller.generate_checksum);
router.post('/api/users/:uID/createTrip', payment_controller.create_trip);
router.post('/api/trips/:tID/transactionStatus', payment_controller.transaction_status);

module.exports = router;