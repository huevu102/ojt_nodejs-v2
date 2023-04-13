const BAD_REQUEST = "BAD_REQUEST";

function isAuthenticated(req) {
	let user = (req.session?req.session.user:null);
	return (user && user.email?true:false);
}

function isAdmin(req) {
	let user = (req.session?req.session.user:null);
	return (user && user.email && user.type?user.type=="admin":false);
}

module.exports = function(app) {
	var middlewares = {
		isAuthenticated: function(req, res, next) {
			if (isAuthenticated(req)) {
				return next();
			} else {
				return res.redirect('/sign-in');
			}
		},

		isAdmin: function(req, res, next) {
			if (isAdmin(req)) {
				return next();
			} else {
				return res.redirect('/');
			}
		},
	};

	return middlewares;
};
