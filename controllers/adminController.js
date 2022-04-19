const { body, validationResult } = require('express-validator');
require('dotenv').config();

module.exports.loginValiations = [
	body('email').not().isEmpty().trim().withMessage('Email is required'),
	body('password').not().isEmpty().withMessage('Password is required'),
];

module.exports.adminLogin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	try {
		if (email === "admin@hrtech.com" && password === "admin@123") {
			return res.status(200).json({ msg: 'You have login successfully' });
		} else {
			return res.status(401).json({ errors: [{ msg: 'Something is wrong' }] });
		}
	} catch (error) {
		return res.status(500).json({ errors: error });
	}
};