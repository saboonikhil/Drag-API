const Cab = require('../models/cab').Cab;
const Partner = require('../models/partner').Partner;

exports.available_cab_list = function (req, res, next) {

    const startTime = req.query.startTime;

    const startTimeUpperLimit = new Date(startTime);
    startTimeUpperLimit.setHours(startTimeUpperLimit.getHours() + 12); // Considering that time fluctuation is allowed for +12hours
    const startTimeISOUpperLimit = startTimeUpperLimit.toISOString();

    const startTimeLowerLimit = new Date(startTime);
    startTimeLowerLimit.setHours(startTimeLowerLimit.getHours() - 12); // Considering that time fluctuation is allowed for -12hours
    var startTimeISOLowerLimit = startTimeLowerLimit.toISOString();

    if ((new Date() - startTimeLowerLimit) > 0) {
        startTimeISOLowerLimit = new Date(startTime).toISOString();
    }

    Cab.find({
        isAvailable: true,
        isBooked: false,
        collegeName: req.query.collegeName,
        $and: [
            { $or: [{ pickup: null }, { pickup: req.query.pickup }] },
            { $or: [{ drop: null }, { drop: req.query.drop }] },
            { $or: [{ startTime: { $lte: startTimeISOUpperLimit, $gte: startTimeISOLowerLimit } }, { startTime: null }] }
        ],
        seats: req.query.seats,
    }).sort({ createdAt: -1 }).exec(function (err, cabs) {
        if (err) return next(err);
        res.json(cabs);
        res.status(201);
    });
};

exports.all_cab_list = function (req, res, next) {
    Cab.find({}).populate('partner').sort({ createdAt: -1 }).exec(function (err, cabs) {
        if (err) return next(err);
        res.json(cabs);
    });
}

exports.add_cab = function (req, res, next) {
    Partner.findById(req.params.pID).populate({ path: 'cabs', populate: { path: 'riders' } }).exec(function (err, partner) {
        if (err) return next(err);
        if (!partner) {
            err = new Error('Failed to load partner');
            err.status = 404;
            return next(err);
        }
        const cab = new Cab(req.body);
        cab.save(function (err, cab) {
            if (err) return next(err);
            res.status(201);
        });
        partner.cabs.push(cab);
        partner.save(function (err) {
            if (err) return next(err);
            res.json(partner)
        });
    });
};

exports.cab_detail = function (req, res, next) {
    Cab.findById(req.params.cID).exec(function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        req.cab = result;
        res.json(req.cab);
    });
};

exports.cab_update = function (req, res, next) {
    Cab.findById(req.params.cID).populate('riders').exec(function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        req.cab = result;
        req.cab.update(req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });
};

exports.cab_check_available = function (req, res, next) {
    Cab.findById(req.params.cID).exec(function (err, cab) {
        if (err) return next(err);
        if (!cab) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        res.json(cab);
        if (cab.isAvailable) {
            cab.update({ isAvailable: false }, function (err, result) {
                if (err) return next(err);
            });
        }
    });
};

exports.cab_delete = function (req, res, next) {
    Cab.findById(req.params.cID).exec(function (err, cab) {
        if (err) return next(err);
        if (!cab) {
            err = new Error('Failed to load Cab');
            err.status = 404;
            return next(err);
        }
        if (cab.isAvailable) {
            Cab.remove({ _id: req.params.cID }, function (err, cab) {
                if (err) return next(err);
                res.json(cab);
            });
        } else {
            err = new Error('Cab unavailable now');
            err.status = 404;
            return next(err);
        }
    })
}