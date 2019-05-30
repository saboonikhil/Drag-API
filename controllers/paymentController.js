const paytm_config = require('../config/paytm/paytm_config').paytm_config;
const paytm_checksum = require('../config/paytm/checksum');
const Cab = require('../models/cab').Cab;
const User = require('../models/user').User;
const Trip = require('../models/trip').Trip;
const orderid = require('../config/orderId')('mysecret');

exports.generate_checksum = function (req, res, next) {
    Cab.findById(req.body.cabBooked).exec(function (err, cab) {
        if (err) return next(err);
        if (!cab) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }

        var paramarray = {};
        paramarray['MID'] = paytm_config.MID; //Provided by Paytm
        paramarray['ORDER_ID'] = orderid.generate();
        paramarray['CUST_ID'] = req.params.uID;  // unique customer identifier
        paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
        paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
        paramarray['TXN_AMOUNT'] = cab.fare; // transaction amount
        paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
        paramarray['CALLBACK_URL'] = 'https://securegw-stage.paytm.in/theia/paytmCallback';//Provided by Paytm
        paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
            if (err) return next(err);
            paramarray['CHECKSUMHASH'] = checksum;
            res.status(200);
            res.json(paramarray);
        });
    });
}

exports.create_trip = function (req, res, next) {
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

            const response =
            {
                "TXNID": "20180926111212800110168766100018551",
                "BANKTXNID": "5583250",
                "ORDERID": "order1",
                "TXNAMOUNT": "100.12",
                "STATUS": req.body.status,
                "TXNTYPE": "SALE",
                "GATEWAYNAME": "WALLET",
                "RESPCODE": "01",
                "RESPMSG": "Txn Success",
                "BANKNAME": "WALLET",
                "MID": "rxazcv89315285244163",
                "PAYMENTMODE": "PPI",
                "REFUNDAMT": "0.00",
                "TXNDATE": "2018-09-26 13:50:57.0"
            }

            var tripStatus = '';
            if (response.STATUS == 'TXN_SUCCESS') {
                tripStatus = 'Completed';
                cab.update({
                    isBooked: true,
                    tripId: req.body.orderId,
                    pickup: req.body.pickup,
                    drop: req.body.drop,
                    startTime: req.body.startTime
                }, function (err) {
                    if (err) return next(err);
                });
                cab.riders.push(user);
            }
            else if (response.STATUS == 'TXN_FAILURE') {
                tripStatus = 'Failed';
                cab.update({ isAvailable: true }, function (err) {
                    if (err) return next(err);
                });
            }
            else if (response.STATUS == 'PENDING') {
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
                checksumHash: req.body.checksumHash,
                rawData: response
            });
            trip.save(function (err) {
                if (err) return next(err);
                res.status(201);
                Trip.populate(trip, { path: "cab" }, function (err, result) {
                    if (err) return next(err);
                    res.json(result);
                });
            });
            user.trips.push(trip);
            user.save(function (err) {
                if (err) return next(err);
            });
        });
    });
}