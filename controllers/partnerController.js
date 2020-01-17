const Partner = require('../models/partner').Partner;
const crypto = require('crypto');
const rand = require('csprng');

exports.list_partner = function (req, res, next) {
    Partner.find({}).populate('cab').populate('user').sort({ createdAt: -1 }).exec(function (err, partners) {
        if (err) return next(err);
        res.json(partners);
    });
};

/*
    add_partner() used by route: /api/admin/signUp
    add_partner function creats a new Partner and is used for Partner signUp from frontend.
    Parameters:
        email: partner email
        password: Password provided by partner
    Response:
        201: Successful creation of Partner object
        401: Respective errors
*/
exports.add_partner = function (req, res, next) {
    const partner = new Partner(req.body);
    const email = partner.email;
    const password = partner.password;

    if (req.query.x_key == "admin@comingsoon.com") {
        if (!(email.indexOf("@") + 1 == email.length)) {
            if (password.length > 4) {
                const temp = rand(160, 36);
                const newpass = temp + password;
                const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
                partner.password = hashed_password;
                partner.salt = temp;

                Partner.find({ email: email }, function (err, partners) {
                    const len = partners.length;
                    if (len == 0) {
                        partner.save(function (err, partner) {
                            if (err) return next(err);
                            res.status(201);
                            res.json({ 'response': "Sucessfully Registered", 'res': true });
                        });
                    }
                    else {
                        res.status(401);
                        res.json({ 'response': "Email already registered", 'res': false });
                    }
                });
            }
            else {
                res.status(401);
                res.json({ 'response': "Password must be of minimum length 5 characters", 'res': false });
            }
        }
        else {
            res.status(401);
            res.json({ 'response': "Email not valid", 'res': false });
        }
    }
    else {
        res.status(451).json({ "message": "You dragged yourself to a wrong place. Drag again maybe?" });
    }
}

/*
	partner_trips populates the trips completed by a partner with specific pID and returns the latest 5 trips with the required skip value.
	Parameters:
		pID: unique ID of the partner from the partner object
		skip: number of values to skip while populating trips
	End point response:
		result.trips: latest 6 trips after skipping the few required trips depending on the skip parameter
*/
exports.partner_trips = function (req, res, next) {
    Partner.findById(req.params.pID).populate({
        path: 'trips', populate: { path: 'riders.id' },
        options: { sort: { 'startTime': -1 }, limit: 6, skip: parseInt(req.query.skip) }
    }).exec(function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load partner');
            err.status = 404;
            return next(err);
        }
        res.json(result.trips);
    });
};

/*
	partner_update() used by route: /api/admin/partners/:pID
	partner_update function updates specific values that needs to be changed and provided by partner
	Parameters:
		pID: partner's unique ID
		other partner parameters in request body
	Response:
		404: When partner not found
		result: response recieved from update function of mongoose
*/
exports.partner_update = function (req, res, next) {
    Partner.findById(req.params.pID).exec(function (err, result) {
        if (err) return next(err);
        if (!result) {
            err = new Error('Failed to load partner');
            err.status = 404;
            return next(err);
        }
        req.partner = result;
        req.partner.update(req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });
};

exports.partner_delete = function (req, res, next) {
    Partner.remove({ _id: req.params.pID }, function (err, partner) {
        if (err) return next(err);
        res.json(partner);
    });
};