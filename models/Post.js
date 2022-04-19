const { model, Schema } = require('mongoose');
const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "user"
			}
		],
		userName: {
			type: String,
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId, //collect id from user collection
			ref: 'user',
		},
	},
	{ timestamps: true }
);
module.exports = model('post', postSchema);
