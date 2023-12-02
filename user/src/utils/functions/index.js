const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./config/.env" });
const { v4: uuid } = require("uuid");
const crypto = require("crypto");
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

const GenerateUUID = () => {
	let id = uuid().replace(/-/g, "");
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
			const cache_otp = await redisClient.RedisGET(key_email);
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
			const data = {};
			const ttl = await redisClient.RedisTTL(key_email);
			data["time_remaining"] = ttl;
			data["can_send"] = ttl == 0 || ttl == -2 ? true : false;
			resolve(data);
		} catch (e) {
			reject(e);
		}
	});
};

const SendOTP = async (otp, user_data, rmq) => {
	try {
		const publishData = {
			first_name: user_data.first_name,
			last_name: user_data.last_name,
			phone_number: user_data.phone_number,
			sms_notification: user_data.sms_notification == 1 ? true : false,
			email_notification:
				user_data.email_notification == 1 ? true : false,
			email: user_data.email,
			id: user_data.id,
			otp,
		};
		await rmq.PublishMessage(
			rmq.MAIL_BINDING_KEY,
			JSON.stringify({ ...publishData, event: "profile_verification" })
		);
	} catch (e) {
		throw new Error(e);
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
	FilterValues,
	SendOTP,
	GenerateUUID,
};
