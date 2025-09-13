const router = require("express").Router();
const authController = require('../controllers/authController');
const auth = require('../utils/passport');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/checkauth', (req,res) => auth(req, res, authController.checkAuth));

module.exports = router;