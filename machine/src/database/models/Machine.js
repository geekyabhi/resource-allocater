const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const MachineSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		image_name: { type: String, required: true },
		default_port: { type: Number ,required:true},
		image: { type: String },
		backGroundImage: { type: String },
		isactive: { type: Boolean, default: false },
		uid :{type:String , required :true},
		machine_id: {
			type: String,
			default: uuidv4,
			unique: true,
			index: true,
		},
		props: { type: mongoose.Schema.Types.Mixed },
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

module.exports = mongoose.model("Machine", MachineSchema);
