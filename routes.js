const express = require('express');
const router = express.Router();
const auth = require('./controllers/auth');
const user_controller = require('./controllers/userController');
const cab_controller = require('./controllers/cabController');
const partner_controller = require('./controllers/partnerController');
const location_controller = require('./controllers/locationController');
const payment_controller = require('./controllers/paymentController');
const ride_controller = require('./controllers/rideController');



router.post('/signIn', auth.signin); //Routes that can be accessed by anyone


router.post('/signUp', user_controller.create_user); //Routes that can be accessed by anyone
//router.get('/api/admin/users', user_controller.user_list); //Routes that can be accessed only by authenticated users
router.get('/api/users/:uID', user_controller.user_detail);
router.put('/api/users/:uID', user_controller.user_update);
router.put('/api/users/:uID/updatePassword', user_controller.update_password);
router.put('/api/users/:uID/sendFeedback', user_controller.send_feedback);
//router.delete('/api/admin/users/:uID', user_controller.user_delete); //Routes-authentication and authorisation both required


router.post('/api/admin/:pID/cabs', cab_controller.add_cab); //Routes-authentication and authorisation both required
router.get('/api/cabs', cab_controller.available_cab_list); //Route that can be accessed by authenticated users
router.get('/api/cabs/:cID/checkCab', cab_controller.cab_check_available);
//router.get('/api/admin/cabs', cab_controller.all_cab_list);
//router.get('/api/cabs/:cID', cab_controller.cab_detail);
router.put('/api/cabs/:cID/makeCab', cab_controller.cab_make_available);
router.put('/api/admin/cabs/:cID', cab_controller.cab_update);
//router.delete('/api/admin/cabs/:cID', cab_controller.cab_delete); //Routes-authentication and authorisation both required


router.post('/api/admin/signUp', partner_controller.add_partner); //Routes-authentication and authorisation both required - Admin Signup
//router.get('/api/admin/partners', partner_controller.list_partner); //partner Routes-authentication and authorisation both required
router.get('/api/admin/partners/:pID', partner_controller.partner_detail); //partner Routes-authentication and authorisation both required
//router.put('/api/admin/partners/:pID', partner_controller.partner_update);
//router.delete('/api/admin/partners/:pID', partner_controller.partner_delete); //Routes-authentication and authorisation both required


//router.post('/api/admin/locations', location_controller.add_location); //Routes-authentication and authorisation both required
router.get('/locations', location_controller.list_location);
//router.get('/api/locations/:lID', location_controller.location_detail);
//router.put('/api/admin/locations/:lID/addSubLocation', location_controller.add_sub_location); //Add Sub Location
//router.delete('/api/admin/locations/:lID', location_controller.location_delete); //Routes-authentication and authorisation both required


router.post('/api/users/:uID/generateChecksum', payment_controller.generate_checksum);
router.post('/api/users/:uID/createTrip', payment_controller.create_trip);


router.get('/api/rides', ride_controller.user_ride_list);
router.get('/api/admin/rides', ride_controller.partner_ride_list);
router.put('/api/users/:uID/joinRide', ride_controller.user_join_ride);

module.exports = router;