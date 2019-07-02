const User = require('../models/user').User;
const Notification = require('../models/notification').Notification;
const Feedback = require('../models/feedback').Feedback;
const crypto = require('crypto');
const rand = require('csprng');

// exports.user_list = function (req, res, next) {
// 	User.find({}).populate('cab').sort({ createdAt: -1 }).exec(function (err, users) {
// 		if (err) return next(err);
// 		res.json({ 'users': users });
// 	});
// };

exports.create_user = function (req, res, next) {
	const user = new User(req.body);
	const email = user.email;
	const password = user.password;

	if (!(email.indexOf("@") + 1 == email.length)) {
		if (password.length > 4) {
			const temp = rand(160, 36);
			const newpass = temp + password;
			const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			user.password = hashed_password;
			user.salt = temp;

			User.find({ email: email }, function (err, users) {
				const len = users.length;
				if (len == 0) {
					user.save(function (err, user) {
						if (err) return next(err);
						res.status(201);
						res.json({ 'response': "Successfully registered! Log in to get started.", 'res': true });
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
};

exports.user_detail = function (req, res, next) {
	User.findById(req.params.uID).populate({ path: 'trips', populate: { path: 'cab' } }).exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		req.user = result;
		res.json(result);
	})
}

exports.user_update = function (req, res, next) {
	User.findById(req.params.uID).populate({ path: 'trips', populate: { path: 'cab' } }).exec(function (err, result) {
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

exports.update_password = function (req, res, next) {
	const password = req.body.password;
	User.findById(req.params.uID).populate({ path: 'trips', populate: { path: 'cab' } }).exec(function (err, user) {
		if (err) return next(err);
		if (!user) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}

		if (password.length > 4) {
			const temp = rand(160, 36);
			const newpass = temp + password;
			const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			user.update({ password: hashed_password, salt: temp }, function (err) {
				if (err) return next(err);
				res.status(200).send({ message: "Password updated successfully" });
			});
		}
		else {
			res.status(401).send({ message: "Password weak" });
		}
	});
};

exports.notification_list = function (req, res, next) {
	Notification.find({}).sort({ updatedAt: -1 }).exec(function (err, notifications) {
		if (err) return next(err);
		res.json(notifications);
	});
};

exports.send_feedback = function (req, res, next) {
	User.findById(req.params.uID).exec(function (err, user) {
		if (err) return next(err);
		if (!user) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}

		var feedback = new Feedback({ user: user._id, message: req.body.message });
		feedback.save(function (err) { if (err) return next(err); });
		res.status(200).send({ message: "Feedback recorded successfully" });
	});
};

// exports.user_delete = function (req, res, next) {
// 	User.remove({ _id: req.params.uID }, function (err, user) {
// 		if (err) return next(err);
// 		res.json(user);
// 	});
// };