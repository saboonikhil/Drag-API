const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	username: {type: String, required: true, max: 100, min: 3},
	email: {type: String, required: true, unique: true, trim: true},
	contact: {type: String, required: true, unique: true},
	alternate_contact: {type: String, default: 'Not Available'},
	trips_completed: {type: Number, default: 0},
	password: {type: String, required: true},
	token: String,
	salt: String,
	temp_str: String,
	created_at: {type: Date, default: Date.now },
	updated_at: {type: Date, default: Date.now },
	cabs_booked: [{type: Schema.ObjectId, ref: 'Cab', default: null}]
});

UserSchema.virtual('url').get(function(){
	return '/user/' + this._id;
});

UserSchema.virtual('updated_at_formatted').get(function(){
	return moment(this.updatedAt).format('MMMM Do, YYYY');
});

UserSchema.method('update', function(updates, callback) {
	if(updates.cabsBooked)
	{
		//append the array here or take this function to controller itself
	}
	Object.assign(this, updates, {updated_at: new Date()});
	this.save(callback);
});


/*UserSchema.statics.authenticate = function(email, password, callback){
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
}*/

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