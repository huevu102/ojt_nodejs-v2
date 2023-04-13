const User = require('../models/user-model');
const Authentication = require('../utils/authentication');
const moment = require('moment')

module.exports = {
	renderSignUpPage: (req, res) => {
		res.render('pages/sign-up', {
			user: {},
			message: ""
		});
	},

	handleSignup: async (req, res) => {
		// Verify user data
		const userData = req.body;
		if (!userData || !userData.email || !userData.password || !userData.name) {
			return res.render('pages/sign-up', {
				user: userData,
				message: "Invalid input. Please check!!!"
			});
		}

		// Verify user
		let user = await User.findOne( { email: userData.email } );
		if (user) {
			return res.render('pages/sign-up', {
				user: userData,
				message: "The email is existed. Please use other email!!!"
			});
		}

		// Create new user
		let userNum = await User.countDocuments({}); //????
		let salt = Authentication.makeSalt();
		user = new User({
			type: (userNum>0?"user":"admin"),
			email: userData.email,
			name: userData.name,
			salt: salt,
			hash_password: Authentication.hashPassword(userData.password, salt),
			secret: Authentication.generate2FaSecret(userData.email),
			active: true, //(userNum>0?false:true)
		});

		// Save user to database
		if (await user.save()) {
			// Auto redirect
			res.redirect('/sign-in');
		} else {
			res.render('pages/sign-up', {
				user: userData,
				message: "Error to create user. Please contact the admin!!!"
			});
		}
	},

	renderUserMgmt: async (req, res) => {
		const users =  await User.find({});
		res.render('pages/users-mgmt', {users: users});
	},

	renderUserQrCode: async (req, res) => {
		let id = req.params.id;
		let user = await User.findById(id);
		if (!user) {
			console.warn("Unable to find user:", id);
			return res.redirect("/")
		}

		let qrCode = Authentication.getF2AQrCode(user.email, user.secret);
		res.render('pages/user-qrcode', {
			qrCode: qrCode,
			secret: user.secret
		});
	},

	updateUser: async (req, res) => {
		await User.updateOne(
			{_id: req.params.id},
			{$set: req.body}
		)
		.then(() => res.redirect('back'))
	},

	deleteUser: async function(req, res) {
		await User.deleteOne({_id: req.params.id})
		// .then(() => res.redirect('back')) //tai sao khong chay??
	}
}
