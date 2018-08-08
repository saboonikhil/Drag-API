const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../models/user').User;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/secret');

const auth = {
	login: function(req,res){
		const email = req.body.email || '';
		const password = req.body.password || '';

		if(email == '' || password == ''){
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid Credentials"
			});
			return;
		}
		//Query the database for email and passowrd
		const dbUserObj = auth.validate(email, password);

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

	validate: function(email, password){
		const dbUserObj = {
			userName: 'Rishab Nahata',
			//..fake data
			//instead query the database with email password
		};
		return dbUserObj;
	},

	validateUser: function(email){
		const dbUserObj = {
			userName: 'Rishab Nahata',
			//..fake data
			//instead query the database with email password
		};
		return dbUserObj;
	},
}

function genToken(user){
	const expires = expiresIn(30); //30 days
	const token = jwt.encode({
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