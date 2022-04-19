const app = require('express');
const router = app.Router();
const { adminLogin, loginValiations } = require('../controllers/adminController');

router.post('/adminLogin', loginValiations, adminLogin);
module.exports = router;