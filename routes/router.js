const express = require('express');
const UserController = require('../controllers/user-controller');
const AuthController = require('../controllers/auth-controller');
const HomeController = require('../controllers/home-controller');
const MiddleWare = require('../controllers/middle-ware');

const router = express.Router();

module.exports = (app) => {
	let mid = MiddleWare(app);

	// Home
	router.get('/', mid.isAuthenticated, HomeController.renderHomePage);

	// Authentication
	router.get('/sign-in', AuthController.renderSignInPage);
	router.post('/sign-in', AuthController.handleSignIn);
	router.get('/sign-out', AuthController.handleSignOut);

	// User Management
	router.get('/sign-up', UserController.renderSignUpPage);
	router.post('/sign-up', UserController.handleSignup);
	router.get('/users-mgmt', mid.isAdmin, UserController.renderUserMgmt);
	router.get('/users-mgmt/qrcode/:id', mid.isAdmin, UserController.renderUserQrCode);
	router.post('/users-mgmt/update/:id', mid.isAdmin, UserController.updateUser);
	router.post('/users-mgmt/delete/:id', mid.isAdmin, UserController.deleteUser);

	// Agendash
	router.get('/dash', mid.isAuthenticated);

	router.get('/error', (req, res) => res.render('pages/error'));

	return app.use(router);
}
