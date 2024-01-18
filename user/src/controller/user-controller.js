const { UserService } = require("../service");

class UserController {
	constructor() {
		this.service = new UserService();
	}

	signUP = async (req, res, next) => {
		try {
			const {
				first_name,
				last_name,
				phone_number,
				email,
				password,
				gender,
			} = req.body;
			const { data } = await this.service.Register({
				first_name,
				last_name,
				phone_number,
				email,
				password,
				gender,
			});

			const filter_data = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone_number,
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				id: data.id,
				admin:data.admin
			};

			

			return res.json({ success: true, data: filter_data });
		} catch (e) {
			next(e);
		}
	};

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body;

			const { data } = await this.service.Login({ email, password });

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	};

	sendOTP = async (req, res, next) => {
		try {
			const { email } = req.body;	
			const data = await this.service.SendOTP(email)
			return res.json({ success: true, data});
		} catch (e) {
			next(e);
		}
	};

	verifyOTP = async (req, res, next) => {
		try {
			const { otp, email } = req.query;
			
			const data = await this.service.VerifyOTP(email,otp)
			
			delete data['password']
			delete data['salt']

			return res.json({
				success: true,
				data
			});
		} catch (e) {
			next(e);
		}
	};

	getAllUsers = async (req, res, next) => {
		try {
			const filters = req.query;
			const data = await this.service.FindAllUsers(filters);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	};

	updateUser = async (req, res, next) => {
		try {
			const updates = req.body;
			const id = req.user.id;
			const data = await this.service.UpdateUser(id, updates);
			const filter_data = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone_number,
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				id: data.id,
			};
			
			return res.json({ success: true, data: filter_data });
		} catch (e) {
			next(e);
		}
	};

	getUserProfile = async (req, res, next) => {
		try {
			const id = req.user.id;
			const user = await this.service.FindOneUser({ id: id });
			return res.json({ success: true, data: user });
		} catch (e) {
			next(e);
		}
	};

	deleteUser = async (req, res, next) => {
		try {
			const id = req.user.id;
			const data = await this.service.DeleteUser(id);
			
			return res.json(data);
		} catch (e) {
			next(e);
		}
	};

	makeAdmin = async(req,res,next)=>{
		try{
			const {email} = req.body
			const data = await this.service.MakeAdmin(email)
			return res.json({ success: true, data });

		}catch(e){
			next(e)
		}
	}
}

module.exports = UserController;
