const { UserRepository } = require("../repository");

const {
	GenerateSalt,
	GenerateUniqueString,
	GeneratePassword,
	FormateData,
	ValidatePassword,
	GenerateSignature,
} = require("../utils/functions");

const { APIError, BadRequestError } = require("../utils/error/app-errors");

class UserService {
	constructor() {
		this.repository = new UserRepository();
	}

	async Register(inputs) {
		try {
			const {
				first_name,
				last_name,
				email,
				password,
				gender,
				phone_number,
			} = inputs;

			let exis_user = 0;

			exis_user = await this.repository.FindUsersCount({ email });

			if (exis_user > 0) throw new BadRequestError("Email Already exist");

			exis_user = await this.repository.FindUsersCount({ phone_number });

			if (exis_user > 0)
				throw new BadRequestError("Number already exist");

			const salt = await GenerateSalt();
			const userPassword = await GeneratePassword(password, salt);
			const id = await GenerateUniqueString();

			console.log(id);

			const new_user = await this.repository.AddUser({
				id,
				email,
				password: userPassword,
				first_name,
				last_name,
				phone_number,
				gender,
				salt,
			});

			return FormateData({
				id: new_user.id,
				email: new_user.email,
				first_name: new_user.first_name,
				last_name: new_user.last_name,
				phone_number: new_user.phone_number,
				gender: new_user.gender,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async Login(inputs) {
		try {
			const { email, password } = inputs;
			const exis_user = await this.repository.FindUsers({ email });
			if (exis_user.length < 1) throw new BadRequestError("Wrong email");

			const user = exis_user[0];

			const { password: user_password, salt: user_salt } = user;

			const validPassword = await ValidatePassword(
				password,
				user_password,
				user_salt
			);

			if (!validPassword) throw new BadRequestError("Wrong password");

			const token = await GenerateSignature({
				email: user.email,
				id: user.id,
			});

			return FormateData({
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				phone_number: user.phone_number,
				token: token,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
}

module.exports = UserService;
