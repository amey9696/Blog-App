const { model, Schema } = require('mongoose');
const otpSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		expireIn: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
module.exports = model('otp', otpSchema);