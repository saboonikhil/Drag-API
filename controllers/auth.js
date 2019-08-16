const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
const Partner = require('../models/partner').Partner;

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const auth = {
	signin: function (req, res) {
		var role = req.body.role;
		const email = req.body.email;
		const password = req.body.password;

		if (role == "partner") {
			if (email == "admin@comingsoon.com")
				role = "admin";
			else
				role = "partner";
		}

		if (email == '' || password == '') {
			res.status(401);
			res.json({ "response": "Invalid Credentials", 'res': false });
			return;
		}

		//Query the database for role, email and password
		if (role == "partner") {
			auth.validatePartner(email, password, function (dbPartnerObj) {
				if (!dbPartnerObj) {
					res.status(401);
					res.json({ "response": "Invalid Credentials", 'res': false });
					return;
				}
				if (dbPartnerObj) {
					if (dbPartnerObj.res) {
						Partner.findById(dbPartnerObj.partner.id).exec(function (err, partner) {
							if (err) return next(err);
							res.json({ 'response': "Logged In Successfully", 'res': true, 'token': genToken(partner) });
						});
					}
					else {
						res.json(dbPartnerObj);
					}
				}
			});
		}
		else {
			auth.validate(email, password, function (dbUserObj) {
				if (!dbUserObj) {
					res.status(401);
					res.json({ "response": "Invalid Credentials", 'res': false });
					return;
				}
				if (dbUserObj) {
					if (dbUserObj.res) {
						User.findById(dbUserObj.user.id).exec(function (err, user) {
							if (err) return next(err);
							res.json({ 'response': "Logged In Successfully", 'res': true, 'token': genToken(user) });
						});
					}
					else {
						res.json(dbUserObj);
					}
				}
			});
		}
	},

	validate: function (email, password, callback) {
		User.find({ email: email }, function (err, users) {
			if (users.length != 0) {
				const temp = users[0].salt;
				const hash_db = users[0].password;
				const id = users[0].token;
				const newpass = temp + password;
				const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
				if (hash_db == hashed_password) {
					callback({ 'user': users[0], 'res': true });
				}
				else {
					callback({ 'response': "Invalid Password", 'res': false });
				}
			} else {
				callback({ 'response': "Email Not Registered", 'res': false });
			}
		});
	},

	validatePartner: function (email, password, callback) {
		Partner.find({ email: email }, function (err, partners) {
			if (partners.length != 0) {
				const temp = partners[0].salt;
				const hash_db = partners[0].password;
				const id = partners[0].token;
				const newpass = temp + password;
				const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
				if (hash_db == hashed_password) {
					callback({ 'partner': partners[0], 'res': true });
				}
				else {
					callback({ 'response': "Invalid Password", 'res': false });
				}
			}
			else {
				callback({ 'response': "Email Not Registered", 'res': false });
			}
		});
	},

	validateUser: function (email, callback) {
		User.find({ email: email }, function (err, users) {
			if (users.length != 0) {
				callback({ 'user': users[0], 'res': true });
			}
			else {
				Partner.find({ email: email }, function (err, partners) {
					if (partners.length != 0)
						callback({ 'user': partners[0], 'res': true, 'role': 'admin' });
					else {
						callback({ 'response': "Email Not Registered", 'res': false });
					}
				})
			}
		});
	}
}

function genToken(dbObj) {
	const expires = expiresIn(180); //180 days
	const token = jwt.sign({
		exp: expires
	}, require('../config/secret')());

	return {
		token: token,
		expires: expires,
		dbObj: dbObj
	};
}

function expiresIn(numDays) {
	const dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;