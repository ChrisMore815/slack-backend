const router = require("express").Router();
const authController = require('../controllers/authController');
const auth = require('../utils/passport');
const multer = require('multer');

const upload = multer({dest: 'public/avatars'});

router.post('/signup', upload.single('avatar'), authController.signUp);
router.post('/signin', authController.signIn);
router.get('/checkauth', (req,res) => auth(req, res, authController.checkAuth));

module.exports = router;