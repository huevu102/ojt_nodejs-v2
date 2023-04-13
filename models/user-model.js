const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	type: { type: String, required: true },					// admin / user
	email: { type: String, required: true },
	hash_password: { type: String, required: true },
	name: String,
	salt: String,
	secret: String,
	active: { type: Boolean, required: true }
}, {
	timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
