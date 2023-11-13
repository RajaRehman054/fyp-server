const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Message1Schema = new Schema(
	{
		conversationId: {
			type: String,
		},
		sender: {
			type: String,
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Message1', Message1Schema);
