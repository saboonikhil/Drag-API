const https = require('https');
const paytm_config = require('../config/paytm/paytm_config').paytm_config;
const paytm_checksum = require('../config/paytm/checksum');
const Cab = require('../models/cab').Cab;
const User = require('../models/user').User;
const Trip = require('../models/trip').Trip;
const Transaction = require('../models/transaction').Transaction;
const uniqueId = require('../config/orderId')('mysecret');

exports.generate_checksum = function (req, res, next) {
    User.findById(req.params.uID).exec(function (err, user) {
        if (err) return next(err);
        if (!user) {
            err = new Error('Failed to load User');
            err.status = 404;
            return next(err);
        }
        Cab.findById(req.body.cabBooked).exec(function (err, cab) {
            if (err) return next(err);
            if (!cab) {
                err = new Error('Failed to load Cab');
                err.status = 404;
                return next(err);
            }

            const orderId = uniqueId.generateOrderId();
            var paramarray = {};

            paramarray['MID'] = paytm_config.MID; //Provided by Paytm
            paramarray['ORDER_ID'] = orderId;
            paramarray['CUST_ID'] = user._id;
            paramarray['MOBILE_NO'] = user.contact;
            paramarray['EMAIL'] = user.email;
            paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
            paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
            paramarray['TXN_AMOUNT'] = cab.fare; // transaction amount
            paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
            paramarray['CALLBACK_URL'] = 'https://securegw-stage.paytm.in/theia/paytmCallback';//Provided by Paytm
            paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
                if (err) return next(err);
                paramarray['CHECKSUMHASH'] = checksum;
                res.status(200).json(paramarray);
            });

            var transaction = new Transaction({ orderId: orderId, cab: cab._id });
            transaction.save(function (err) { if (err) return next(err); });
        });
    });
}

exports.create_trip = function (req, res, next) {
    Transaction.find({ orderId: req.body.orderId }).exec(function (err, txns) {
        Transaction.remove({ _id: txns[0]._id }, function (err) {
            if (err) return next(err);
        });
    });

    Cab.findById(req.body.cabBooked).exec(function (err, cab) {
        if (err) return next(err);
        if (!cab) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        User.findById(req.params.uID).exec(function (err, user) {
            if (err) return next(err);
            if (!user) {
                err = new Error('Failed to load User');
                err.status = 404;
                return next(err);
            }

            var paytmParams = {};
            paytmParams["MID"] = paytm_config.MID;
            paytmParams["ORDERID"] = req.body.orderId;

            paytm_checksum.genchecksum(paytmParams, paytm_config.MERCHANT_KEY, function (err, checksum) {
                paytmParams["CHECKSUMHASH"] = checksum;
                var post_data = JSON.stringify(paytmParams);

                var options = {
                    //hostname: 'securegw-stage.paytm.in',
                    hostname: 'securegw.paytm.in',
                    port: 443,
                    path: '/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                var response = {};
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response = JSON.parse(chunk);
                    });

                    post_res.on('end', function () {

                        var tripStatus = '';
                        if (response.STATUS == "TXN_SUCCESS") {
                            tripStatus = 'Completed';
                            cab.update({
                                tripId: req.body.orderId,
                                pickup: req.body.pickup,
                                drop: req.body.drop,
                                startTime: req.body.startTime
                            }, function (err) {
                                if (err) return next(err);
                            });
                            cab.riders.push(user);
                        }
                        else if (response.STATUS == "TXN_FAILURE") {
                            tripStatus = 'Failed';
                            cab.update({ isAvailable: true }, function (err) {
                                if (err) return next(err);
                            });
                        }
                        else if (response.STATUS == "PENDING") {
                            tripStatus = 'Processing';
                        }

                        var trip = new Trip({
                            status: tripStatus,
                            cab: cab._id,
                            travelDetails: {
                                tripId: req.body.orderId,
                                pickup: req.body.pickup,
                                drop: req.body.drop,
                                startTime: req.body.startTime,
                                seats: req.body.seats,
                                fare: req.body.fare
                            },
                            rawData: response
                        });
                        trip.save(function (err) {
                            if (err) return next(err);
                            Trip.populate(trip, { path: "cab" }, function (err, result) {
                                if (err) return next(err);
                                res.status(201).json(result);
                            });
                        });

                        user.trips.push(trip);
                        user.save(function (err) { if (err) return next(err); });
                    });
                });

                post_req.write(post_data);
                post_req.end();
            });
        });
    });
}