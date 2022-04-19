const app = require('express');
const router = app.Router();
const { register, registerValiations, login, loginValiations, ForgotPasswordValidations, emailSend, changePassword, OtpValidations } = require('../controllers/userController');
router.post('/register', registerValiations, register);
router.post('/login', loginValiations, login);
router.post('/forgotPassword', ForgotPasswordValidations, emailSend);
router.post('/enterOtp', OtpValidations, changePassword);

// router.get("/:id/verify/:token", verificationLink)
module.exports = router;