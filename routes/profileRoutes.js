const express = require('express');
const router = express.Router();
const auth = require('../utils/auth.js');
const { updateName, updatePassword, updatePasswordValidations } = require("../controllers/profileController");

router.post('/updateName', auth,updateName );
router.post('/updatePassword', [auth,updatePasswordValidations],updatePassword );
module.exports = router;