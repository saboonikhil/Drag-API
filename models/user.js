const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
	userName: {type: String, required: true, max: 100, min: 3},
	email: {type: String, required: true, unique: true, trim: true},
	contact: {type: String, required: true, unique: true},
	alternateContact: {type: String, default: 'Not Available'},
	tripsCompleted: {type: Number, default: 0},
	password: {type: String, required: true},
	createdAt: {type: Date, default: Date.now },
	updatedAt: {type: Date, default: Date.now },
	cabsBooked: [{type: Schema.ObjectId, ref: 'Cab', default: null}]
});

UserSchema.virtual('url').get(function(){
	return '/user/' + this._id;
});

UserSchema.virtual('updatedAt_formatted').get(function(){
	return moment(this.updatedAt).format('MMMM Do, YYYY');
});

UserSchema.method('update', function(updates, callback) {
	if(updates.cabsBooked)
	{
		//append the array here or take this function to controller itself
	}
	Object.assign(this, updates, {updatedAt: new Date()});
	this.save(callback);
});


UserSchema.statics.authenticate = function(email, password, callback){
	User.findOne({email: email})
	.exec(function(err, user){
		if(err) return callback(err);
		else if(!user){
			const err = new Error('User Not Found');
			err.status = 401;
			return callback(err);
		}
		bcrypt.compare(password,user.password, function(err, result){
			if(result === true) return callback(null, user);
			else return callback();
		})

	});
}

UserSchema.pre('save', function(next){
	const user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	})
});

const User = mongoose.model('User', UserSchema);

module.exports = {
	User: User	
}