const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APIError, AuthorizationError } = require("../error/app-errors");
require("dotenv").config({ path: "./config/.env" });
const { v4: uuid } = require("uuid");
const crypto = require("crypto");
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
			return true;
		} else {
			throw new AuthorizationError(`No token found`);
		}
		return false;
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
};
