const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const rand = require('csprng');
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bodyParser = require('body-parser');
const User = require('../models/user').User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/secret');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const auth = {
	signin: function(req,res){
		const email = req.body.email;
		const password = req.body.password;

		if(email == '' || password == ''){
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid Credentials"
			});
			return;
		}
		//Query the database for email and passowrd
		var dbUserObj;
		auth.validate(email, password, function(dbUserObj){
			dbUserObj = dbUserObj;
		});
		if(!dbUserObj)
		{
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid Credentials"
			});
			return;
		}
		if(dbUserObj){
			res.json(genToken(dbUserObj));
		}
	},

	validate: function(email, password, callback){

		var d;
		User.find({email: email}, function(err, users){
			if(err) return callback(err, null);
			if(users.length!=0){
				const temp = users[0].salt;
				const hash_db = users[0].password;
				const id = users[0].token;
				const newpass = temp + password;
				const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
				if(hash_db == hashed_password){
					callback(null, users[0]);
				}
			}
		});
	}
}

function genToken(user){
	const expires = expiresIn(30); //30 days
	const token = jwt.sign({
		exp: expires
	}, require('../config/secret')());

	return {
		token: token,
		expires: expires,
		user: user
	};
}

function expiresIn(numDays){
	const dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;