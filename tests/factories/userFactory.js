const mongose = require('mongoose');
const User = mongose.model('User');

module.exports = () => {
	return new User({}).save();
};