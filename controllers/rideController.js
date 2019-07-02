const Cab = require('../models/cab').Cab;
const User = require('../models/user').User;
const Trip = require('../models/trip').Trip;
const uniqueId = require('../config/tripId')('mysecret');

exports.add_ride = function (req, res, next) {
    if (req.query.x_key == "admin@comingsoon.com") {
        const ride = new Cab(req.body);
        ride.save(function (err, ride) {
            if (err) return next(err);
            res.status(201).json(ride);
        });
    }
    else {
        var ride = new Cab({
            isAvailable: false,
            tripId: req.query.x_key,
            city: req.body.city,
            pickup: req.body.pickup,
            drop: req.body.drop,
            startTime: req.body.startTime,
            seats: req.body.seats
        });
        ride.save(function (err, ride) {
            if (err) return next(err);
            res.status(201).json(ride);
        });
    }
};

exports.user_ride_list = function (req, res, next) {
    const startTime = req.query.startTime;

    const startTimeUpperLimit = new Date(startTime);
    startTimeUpperLimit.setHours(startTimeUpperLimit.getHours() + 6);
    const startTimeISOUpperLimit = startTimeUpperLimit.toISOString();

    const startTimeLowerLimit = new Date(startTime);
    startTimeLowerLimit.setHours(startTimeLowerLimit.getHours() - 6);
    var startTimeISOLowerLimit = startTimeLowerLimit.toISOString();

    if ((new Date() - startTimeLowerLimit) > 0) {
        startTimeISOLowerLimit = new Date(startTime).toISOString();
    }

    Cab.find({
        isAvailable: true,
        carName: null,
        city: null,
        pickup: req.query.pickup,
        drop: req.query.drop,
        startTime: { $lte: startTimeISOUpperLimit, $gte: startTimeISOLowerLimit },
        seats: { $gte: req.query.seats },
    }).sort({ seats: 1 }).exec(function (err, cabs) {
        if (err) return next(err);
        res.status(200).json(cabs);
    });
};

exports.partner_ride_list = function (req, res, next) {
    if (req.query.x_key != "admin@comingsoon.com") {
        Cab.find({
            isAvailable: false,
            carName: null,
            city: null
        }).sort({ startTime: 1 }).populate('riders').exec(function (err, cabs) {
            if (err) return next(err);
            res.status(200).json(cabs);
        });
    }
    else {
        Cab.find({
            isAvailable: false,
            carName: null
        }).sort({ startTime: 1 }).populate('riders').exec(function (err, cabs) {
            if (err) return next(err);
            res.status(200).json(cabs);
        });
    }
};

exports.user_join_ride = function (req, res, next) {
    var proceed = 'true';
    Cab.findById(req.body.ride).exec(function (err, ride) {
        if (err) return next(err);
        if (!ride) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }

        const seatsAvailable = ride.seats;
        const seatsBooked = req.body.seats;
        const seatsLeft = seatsAvailable - seatsBooked;
        if (seatsLeft >= 0) {
            User.findById(req.params.uID).populate({ path: 'trips', populate: { path: 'cab' } }).exec(function (err, user) {
                if (err) return next(err);
                if (!user) {
                    err = new Error('Failed to load User');
                    err.status = 404;
                    return next(err);
                }

                var trips = user.trips;
                for (var i = 0; i < trips.length; i++) {
                    if (trips[i].cab != null && trips[i].cab.carName == null) {
                        proceed = 'false';
                        res.status(401).json({ "message": "Only one ride allowed" });
                    }
                }

                if (proceed == 'true') {
                    const tripId = uniqueId.generateTripId();
                    var seatsEmpty = true;
                    var updatedTripId;
                    if (seatsLeft == 0)
                        seatsEmpty = false;

                    if (ride.tripId != null)
                        updatedTripId = ride.tripId + '-' + tripId;
                    else
                        updatedTripId = tripId;

                    ride.update({ isAvailable: seatsEmpty, tripId: updatedTripId, seats: seatsLeft }, function (err) {
                        if (err) return next(err);
                    });
                    ride.riders.push(user);

                    var trip = new Trip({
                        status: "Sharing",
                        cab: ride._id,
                        travelDetails: {
                            tripId: tripId,
                            pickup: ride.pickup,
                            drop: ride.drop,
                            startTime: ride.startTime,
                            seats: req.body.seats
                        }
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
                }
            });
        }
        else {
            res.status(401).json({ "message": "Seats not available" });
        }
    });
};