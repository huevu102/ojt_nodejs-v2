require('dotenv').config();
const User = require('../models/user-model');
const Authentication = require('../utils/authentication');

// Signin
const renderSignInPage = async (req, res) => {
	res.render('pages/sign-in', {
		user: {},
		message: ""
	})
}

const handleSignIn = async (req, res) => {
	let userData = req.body
	try {
		// Verify user data
		if (!userData || !userData.email || !userData.password) {
			let message = "Invalid input. Please check again!!";
			console.warn(message)
			return res.render('pages/sign-in', {
				user: userData,
				message: message
			});
		}

		// Check user on database
		let user = await User.findOne( { email: userData.email } );
		if (!user) {
			let message = "The user is not existed. Please Sign-up now!!";
			console.warn(message)
			return res.render('pages/sign-in', {
				user: userData,
				message: message
			});
		}
		if (!user.active) {
			let message = "The user is not active. Please contact the admin!!";
			console.warn(message)
			return res.render('pages/sign-in', {
				user: userData,
				message: message
			});
		}

		// Verify password
		if (Authentication.hashPassword(userData.password, user.salt)!=user.hash_password) {
			let message = "Invalid password. Please check input data!!";
			console.warn(message)
			return res.render('pages/sign-in', {
				user: userData,
				message: message
			});
		}

		// Verify 2FA
		if (process.env.USE_2FA.toUpperCase()=="YES") {
			if (!Authentication.is2FAValidCode(user.secret, userData.gaCode)) {
				let message = "Invalid GA Code. Please check input data!!";
				console.warn(message);
				return res.render('pages/sign-in', {
					user: userData,
					message: message
				});
			}
		}

		// Store in session  ?????
		req.session.user = {
			name: user.name,
			email: user.email,
			type: user.type
		};

		// Login success, auto redirect to homepage
		console.log("Signin success for:", user.name, user.email);
		return res.redirect('/')
	} catch (error) {
		let message = error.toString()
		console.error(message)
		return res.render('pages/sign-in', {
			user: userData,
			message: message
		});
	}
}

const handleSignOut = async (req, res) => {
	// Clear user in session
	delete req.session.user
	return res.redirect('/sign-in')
}

module.exports = { renderSignInPage, handleSignIn, handleSignOut }
