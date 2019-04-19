const User = require('../models/user').User;
const async = require('async');
const crypto = require('crypto');
const rand = require('csprng');
const mongoose = require('mongoose');

exports.user_list = function (req, res, next) {
	User.find({}).populate('cab').sort({ createdAt: -1 }).exec(function (err, users) {
		if (err) return next(err);
		res.json({ 'users': users });
	});
};

exports.create_user = function (req, res, next) {
	const user = new User(req.body);
	const email = user.email;
	const password = user.password;

	if (!(email.indexOf("@") + 1 == email.length)) {
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && password.length > 4 && password.match(/[0-9]/) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
			const temp = rand(160, 36);
			const newpass = temp + password;
			const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			user.password = hashed_password;
			user.salt = temp;

			User.find({ email: email }, function (err, users) {
				const len = users.length;
				if (len == 0) {
					user.populate('cab').save(function (err, user) {
						if (err) return next(err);
						res.status(201);
						res.json({ 'response': "Sucessfully Registered", 'res': true });
					});
				}
				else {
					res.status(401);
					res.json({
						'response': "Email already registered", 'res': false
					});
				}
			});
		}
		else {
			res.status(401);
			res.json({
				'response': "Password weak", 'res': false
			});
		}
	}
	else {
		res.status(401);
		res.json({
			'response': "Email not valid", 'res': false
		});
	}
};

exports.user_detail = function (req, res, next) {
	User.findById(req.params.uID).populate('cabsBooked').exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = result;
		res.json(req.user);
	});
};

exports.user_update = function (req, res, next) {
	User.findById(req.params.uID).populate('cabsBooked').exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = result;
		req.user.update(req.body, function (err, result) {
			if (err) return next(err);
			res.json(result);
		});
	});
};

exports.user_book_cab = function (req, res, next) {
	User.findById(req.params.uID).populate('cabsBooked').exec(function (err, user) {
		if (err) return next(err);
		if (!user) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		user.cabsBooked.push(req.body.cabsBooked);
		user.save(function (err) {
			if (err) return next(err);
			res.json(user);
		});
	});
};

exports.user_delete = function (req, res, next) {
	User.remove({ _id: req.params.uID }, function (err, user) {
		if (err) return next(err);
		res.json(user);
	});
};
