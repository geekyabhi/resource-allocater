const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		id: { type: String, required: true, unique: true },
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone_number: { type: String, required: true, unique: true },
		gender: { type: String },
		salt: { type: String },
		verified: { type: Boolean, default: false },
		admin: { type: Boolean, default: false },
		email_notification: { type: Boolean, default: false },
		sms_notification: { type: Boolean, default: false },
		created_at: {
			type: Date,
			default: Date.now,
		},
		updated_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

UserSchema.pre("save", function (next) {
	const currentDate = new Date();

	this.updated_at = currentDate;

	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});

module.exports = mongoose.model("User", UserSchema);
