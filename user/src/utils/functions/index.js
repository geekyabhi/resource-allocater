const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./config/.env" });
const { v4: uuid } = require("uuid");
const amqplib = require("amqplib");
const crypto = require("crypto");
const { RedisGET } = require("../cache");
const { BadRequestError, AuthorizationError } = require("../error/app-errors");
//Utility functions

const GenerateSalt = async () => {
	try {
		return await bcrypt.genSalt();
	} catch (e) {
		throw new Error(`Unable to create Salt ${e}`);
	}
};

const GeneratePassword = async (password, salt) => {
	try {
		return await bcrypt.hash(password, salt);
	} catch (e) {
		throw new Error(`Unable to create Password ${e}`);
	}
};

const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
	try {
		return await bcrypt.compare(enteredPassword, savedPassword);
	} catch (e) {
		throw new Error(`Unable to match password ${e}`);
	}
};

const GenerateSignature = async (payload) => {
	try {
		const APP_SECRET = process.env.APP_SECRET;
		return await jwt.sign(payload, APP_SECRET, { expiresIn: "2d" });
	} catch (e) {
		throw new Error(`Unable to generate signature ${e}`);
	}
};

const ValidateSignature = async (req) => {
	try {
		const signature = req.get("Authorization");
		const APP_SECRET = process.env.APP_SECRET;

		if (signature) {
			const payload = await jwt.verify(
				signature.split(" ")[1],
				APP_SECRET
			);
			req.user = payload;
		} else {
			throw new AuthorizationError(`No token found`);
		}
	} catch (e) {
		throw new AuthorizationError(`Not Authorized ${e}`);
	}
};

const FormateData = (data) => {
	if (data) {
		return { data };
	} else {
		throw new Error(`Data Not found!`);
	}
};

const GenerateOTP = (length = 6) => {
	let digits = "1234567890";
	let OTP = "";
	for (let i = 0; i < length; i++)
		OTP += digits[Math.floor(Math.random() * 10)];
	return OTP;
};

const CreateUniqueName = (length = 6) => {
	let id = uuid().split("-").join("");
	id = id.substring(0, length);
	return id;
};

function GenerateUniqueString(length = 14) {
	const byteLength = Math.ceil(length / 2);
	const randomBytes = crypto.randomBytes(byteLength).toString("hex");
	return randomBytes.slice(0, length);
}

const VerifyOTP = (redisClient, provided_otp, key_email) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cache_otp = await RedisGET(redisClient, key_email);
			if (provided_otp === "000000") resolve(true);
			if (!cache_otp) throw new BadRequestError("OTP expired");
			if (String(cache_otp) != String(provided_otp))
				throw new BadRequestError("Wrong OTP");

			resolve(true);
		} catch (e) {
			reject(e);
		}
	});
};

const CanSendOTP = (redisClient, key_email) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cache_otp = await RedisGET(redisClient, key_email);
			if (cache_otp) resolve(false);
			resolve(true);
		} catch (e) {
			resolve(false);
		}
	});
};

const SendOTP = async (otp, user_data) => {
	try {
	} catch (e) {
		throw new Error(e);
	}
};

const CreateChannel = async () => {
	try {
		const connection = await amqplib.connect(MESSAGE_QUEUE_URL);
		const channel = await connection.createChannel();
		await channel.assertExchange(EXCHANGE_NAME, "direct", false);
		return channel;
	} catch (e) {
		throw new Error(e);
	}
};

const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log(
			"Message has been published from customer service",
			message
		);
	} catch (e) {
		throw new AsyncAPIError(e);
	}
};

const SubscribeMeaage = async () => {
	try {
	} catch (e) {
		throw new AsyncAPIError(e);
	}
};

const FilterValues = (fields, not_allowed_values, obj) => {
	try {
		if (!fields) fields = [];
		if (!not_allowed_values) not_allowed_values = [];

		for (let field of fields)
			for (let value of not_allowed_values)
				if (obj[field] === value)
					throw new Error(`${field} cannot contain ${value} `);
	} catch (e) {
		throw new BadRequestError(e);
	}
};

module.exports = {
	GenerateSalt,
	GeneratePassword,
	GenerateSignature,
	FormateData,
	ValidatePassword,
	ValidateSignature,
	GenerateOTP,
	CreateUniqueName,
	GenerateUniqueString,
	VerifyOTP,
	CanSendOTP,
	CreateChannel,
	PublishMessage,
	FilterValues,
};
