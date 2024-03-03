const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./config/.env" });
const { v4: uuid } = require("uuid");
const crypto = require("crypto");
// const { BadRequestError, AuthorizationError } = require("../error/app-errors");

const ValidateSignature = async (token) => {
	try {
		const APP_SECRET = process.env.APP_SECRET;
		if (token) {
			const payload = await jwt.verify(
				token,
				APP_SECRET
			);
			return payload
		} else {
			throw new AuthorizationError(`No token found`);
		}
	} catch (e) {
		throw new AuthorizationError(`Not Authorized ${e}`);
	}
};

const DecodeSignature = (token)=>{
	try{
		const APP_SECRET = process.env.APP_SECRET;
		const payload = jwt.verify(token,APP_SECRET)
		return payload
	}catch(e){
		throw Error(e)
	}
}

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


module.exports = {
	FormateData,
	ValidateSignature,
	GenerateOTP,
	CreateUniqueName,
	GenerateUUID,
	DecodeSignature
};
