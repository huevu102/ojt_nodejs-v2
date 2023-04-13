const { statsUser } = require('../controllers/report-controller.js');

module.exports = {
	renderHomePage: async (req, res) => {
		try {
			const data = await statsUser();
			res.render('pages/home', { data: data });
		} catch (err) {
			console.log(err)
		}
	}
}
