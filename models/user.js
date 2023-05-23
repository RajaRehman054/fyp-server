var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	username: {
		type: String,
		default: '',
	},
	email: {
		type: String,
		default: '',
	},
	buyer: {
		type: Boolean,
		default: false,
	},
	fcm: {
		type: String,
		default: '',
	},
	picture: { type: String, default: null },
	sales: { type: Number, default: 0 },
	followers: { type: Number, default: 0 },
	following: { type: Number, default: 0 },
});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
