const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const Otp = require('../models/Otp');
const nodeMailer=require('nodemailer');

const createToken = (user) => {
	return jwt.sign({ user }, process.env.SECRET, {
		expiresIn: '7d',
	});
};

module.exports.registerValiations = [
	body('name').not().isEmpty().trim().withMessage('Name is required'),
	body('email').not().isEmpty().trim().withMessage('Email is required'),
	body('password').isLength({ min: 6 }).withMessage('Password must be 6 characters long'),
];

module.exports.register = async (req, res) => {
	const { name, email, password } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const checkUser = await User.findOne({ email });
		if (checkUser) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Email is already taken' }] });
		}
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		try {
			const user = await User.create({
				name,
				email,
				password: hash,
			});
			// const url =`${process.env.BASE_URL}/user/${User._id}/verify/${token}`;
			// verifyMail( email, "Account Verification link", url );
			const token = createToken(user);
			return res.status(200).json({ msg: 'Your account has been created', token });
			// return res.status(200).json({ msg: 'An Verification link send to your Email. Please Verify Your account', token });
		} catch (error) {
			return res.status(500).json({ errors: error });
		}
	} catch (error) {
		return res.status(500).json({ errors: error });
	}
};

module.exports.loginValiations = [
	body('email').not().isEmpty().trim().withMessage('Email is required'),
	body('password').not().isEmpty().withMessage('Password is required'),
];

module.exports.login = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			const matched = await bcrypt.compare(password, user.password);
			if (matched) {
				const token = createToken(user);
				return res.status(200).json({ msg: 'You have login successfully', token });
			} else {
				return res.status(401).json({ errors: [{ msg: 'Password is not correct' }] });
			}
		} else {
			return res.status(404).json({ errors: [{ msg: 'Email not found' }] });
		}
	} catch (error) {
		return res.status(500).json({ errors: error });
	}
};

module.exports.ForgotPasswordValidations = [
	body('email').not().isEmpty().trim().withMessage('Email is required'),
];

module.exports.emailSend = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			let code = Math.floor((Math.random() * 10000) + 1);
			let otpData = await Otp.create({
				email,
				code,
				expireIn: new Date().getTime() + 300 * 500 
			});
			// console.log(email, otpData.code);
			mailer(email, otpData.code);
			return res.status(200).json({ msg: 'OTP send on your email id' });
		} else {
			return res.status(404).json({ errors: [{ msg: 'Email not found' }] });
		}
	} catch (error) {
		return res.status(500).json({ errors: error });
	}
}

module.exports.OtpValidations = [
	body('code').not().isEmpty().trim().withMessage('otp is required'),
	body('password').isLength({ min: 6 }).withMessage('Password must be 6 characters long'),
];

module.exports.changePassword = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}else{
		const { code, password } = req.body;
		try {
			const data =await Otp.findOne({ code });
			if(data){
				let currentTime=new Date().getTime();
				let diff=data.expireIn-currentTime;
				if(diff < 0 ){
					return res.status(404).json({ errors: [{ msg: 'Otp is Expired' }] });
				}else{
					// Hash password
					const salt = await bcrypt.genSalt(10);
					const hash = await bcrypt.hash(password, salt);
					const newUser= await User.findOneAndUpdate({email:data.email},{password:hash},{new:true});
					return res.status(200).json({msg:'Your password has been Changed successfully.  Please click on Login and login using new password'})
				}
			}else{
				return res.status(404).json({ errors: [{ msg: 'Invalid Otp' }] });
			}
		} catch (error) {
			return res.status(500).json({ errors: error });
		}
	}
}

const mailer = (email, otp) => {
	try {
		let transporter =nodeMailer.createTransport({
			service:'gmail',
			auth:{
				user:process.env.EMAIL,
				pass:process.env.PASSWORD
			}
		});

		let mailOptions={
			from:process.env.EMAIL,
			to:email,
			subject:'Your otp for forgot passsword',
			text:`your otp is: ${otp}. Your otp is valid for 5 minutes.`
		};

		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				console.log(error);
			}else{
				console.log("Email sent: "+info.response);
			}
		})
	} catch (error) {
		return res.status(500).json({ errors: error, msg: 'Something went wrong' });
	}
}

// const verifyMail= async (email, subject, text)=>{
// 	try {
// 		let transporter =nodeMailer.createTransport({
// 			host:process.env.HOST,
// 			service:process.env.SERVICE,
// 			port:Number(process.env.EMAIL_PORT),
// 			secure:Boolean(process.env.SECURE),
// 			auth:{
// 				user:process.env.EMAIL,
// 				pass:process.env.PASSWORD
// 			}
// 		});

// 		let mailOptions={
// 			from:process.env.EMAIL,
// 			to:email,
// 			subject:subject,
// 			text:text,
// 		};

// 		await transporter.sendMail(mailOptions, function(error, info){
// 			if(error){
// 				console.log(error);
// 			}else{
// 				console.log("Email sent: "+info.response);
// 			}
// 		})
// 	} catch (error) {
// 		return res.status(500).json({ errors: error, msg: 'Something went wrong' });
// 	}
// }

// module.exports.verificationLink = async (req, res) => {
// 	try {
//         const user= await User.findOne({_id:req.params.id});
//         if(!user){
// 			return res.status(400).json({ errors: "Invalid Link" });
//         }
// 		await User.updateOne({_id:user._id, verified:true})
// 		const token = createToken(user);
// 		return res.status(200).json({msg:'Email verified successfully'})
//     } catch (error) {
// 		return res.status(500).json({ errors: error, msg: 'Something went wrong' });
//     }
// }