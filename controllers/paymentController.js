const https = require('https');
const request = require('request');
var dateFormat = require('dateformat');
const paytm_config = require('../config/paytm/paytm_config').paytm_config;
const paytm_checksum = require('../config/paytm/checksum');
const Cab = require('../models/cab').Cab;
const User = require('../models/user').User;
const Partner = require('../models/partner').Partner;
const uniqueId = require('../config/orderId')('mysecret');
const winston = require('../config/winston');

exports.generate_checksum = function (req, res, next) {
    User.findById(req.params.uID).exec(function (err, user) {
        if (err) return next(err);
        if (!user) {
            err = new Error('Failed to load User');
            err.status = 404;
            return next(err);
        }
        Cab.findById(req.body.cabTypeSelected).exec(function (err, cab) {
            if (err) return next(err);
            if (!cab) {
                err = new Error('Failed to load Cab');
                err.status = 404;
                return next(err);
            }

            var txnAmount = '';
            if (req.body.paymentMode == 'Full') {
                txnAmount = cab.carNumber;
            }
            else if (req.body.paymentMode == 'Advance') {
                txnAmount = (0.2 * parseFloat(cab.carNumber)).toFixed(2).toString();
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
            paramarray['TXN_AMOUNT'] = txnAmount; // transaction amount
            paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
            paramarray['CALLBACK_URL'] = 'https://securegw.paytm.in/theia/paytmCallback';//Provided by Paytm
            paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
                if (err) return next(err);
                paramarray['CHECKSUMHASH'] = checksum;
                res.status(200).json(paramarray);
            });

            // var transaction = new Transaction({ orderId: orderId, cab: cab._id });
            // transaction.save(function (err) { if (err) return next(err); });
        });
    });
}

exports.create_trip = function (req, res, next) {
    // Transaction.find({ orderId: req.body.orderId }).exec(function (err, txns) {
    //     Transaction.remove({ _id: txns[0]._id }, function (err) {
    //         if (err) return next(err);
    //     });
    // });

    Cab.findById(req.body.cabTypeSelected).exec(function (err, cab) {
        if (err) return next(err);
        if (!cab) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }

        var seatsBooked = '';
        if (cab.type == 'Sedan') { seatsBooked = 4; }
        else if (cab.type == 'SUV') { seatsBooked = 6; }

        Partner.findById(cab.partner).exec(function (err, partner) {
            if (err) return next(err);
            if (!partner) {
                err = new Error('Failed to load Cab');
                err.status = 404;
                return next(err);
            }

            User.findById(req.params.uID).exec(function (err, rider) {
                if (err) return next(err);
                if (!rider) {
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

                            var status = '';
                            if (response.STATUS == "TXN_SUCCESS") {
                                if (response.TXNAMOUNT == parseFloat(cab.carNumber).toFixed(2).toString()) {
                                    status = 'Payment Successful';
                                }
                                else {
                                    status = 'Trip Confirmed';
                                }
                            } else if (response.STATUS == "TXN_FAILURE") {
                                status = 'Payment Failed';
                            } else if (response.STATUS == "PENDING") {
                                status = 'Payment In Process';
                            }

                            var trip = new Cab({
                                type: cab.type,
                                pickup: req.body.pickup,
                                drop: req.body.drop,
                                startTime: req.body.startTime,
                                fare: parseFloat(cab.carNumber).toFixed(2).toString(),
                                riders: [{
                                    id: rider._id,
                                    tripId: req.body.orderId,
                                    tripStatus: status,
                                    pickup: req.body.pickup,
                                    drop: req.body.drop,
                                    seats: seatsBooked,
                                    fare: response.TXNAMOUNT,
                                    luggageCount: cab.driverContact,
                                    rawData: response
                                }],
                                partner: partner._id,
                                carName: cab.type
                            });

                            trip.save(function (err) { if (err) return next(err); });

                            if (response.STATUS == "TXN_SUCCESS") {
                                partner.trips.push(trip);
                                partner.save(function (err) { if (err) return next(err); });

                                var rider_sms_data = {
                                    From: 'DRAGRT',
                                    To: rider.contact.substring(4),
                                    VAR1: rider.name.split(' ')[0],
                                    VAR2: req.body.orderId,
                                    VAR3: req.body.pickup,
                                    VAR4: req.body.drop,
                                    VAR5: dateFormat(new Date(req.body.startTime), "h:MM TT"),
                                    VAR6: dateFormat(new Date(req.body.startTime), "mmm d")
                                };

                                message = `Hi ${rider_sms_data['VAR1']}!\n\nYour ride is booked (Trip ID: ${rider_sms_data['VAR2']})` +
                                    ` from ${rider_sms_data['VAR3']} to ${rider_sms_data['VAR4']} starting at ${rider_sms_data['VAR5']}` +
                                    ` on ${rider_sms_data['VAR6']}.\n\nNote: Your ride fare doesn't include parking charges if any.` +
                                    ` Driver and cab details will be shared 2 hrs before the pickup time.\n\nCherish the Journey,\nTeam Drag`

                                var options = {
                                    method: 'POST',
                                    url: 'http://msg.bulksmsblaze.com/rest/services/sendSMS/sendGroupSms',
                                    qs: { AUTH_KEY: '92b98317846c1623b384e7888405e69' },
                                    headers:
                                    {
                                        'Cache-Control': 'no-cache',
                                        'Content-Type': 'application/json'
                                    },
                                    body:
                                    {
                                        smsContent: message,
                                        routeId: '1',
                                        mobileNumbers: rider_sms_data['To'],
                                        senderId: rider_sms_data['From'],
                                        signature: 'signature',
                                        smsContentType: 'english'
                                    },
                                    json: true
                                };
                                request(options, function (error, response, body) {
                                    if (error) throw new Error(error);
                                    winston.info(`Message sent to ${rider_sms_data['To']}` +
                                        ` with responseCode: ${body['responseCode']}, response: ${body['response']}.`);
                                });
                            }

                            rider.trips.push(trip);
                            rider.save(function (err) { if (err) return next(err); });
                            res.status(201).json(trip);
                        });
                    });

                    post_req.write(post_data);
                    post_req.end();
                });
            });
        });
    });
}