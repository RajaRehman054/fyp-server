var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../middleware/auth');
var profilingModule = require('../controllers/profilingModule');
var pictureHandler = require('../middleware/pictureHandler');

// ? Profiling Module Routes //
router.get('/otp/:email', profilingModule.getOtp);
router.get('/otpVerify/:email/:otp', profilingModule.verifyOtp);
router.get('/picture', profilingModule.getPicture);
router.get('/user', authenticate.verifyUser, profilingModule.getUser);
router.post('/register', profilingModule.register);
router.post('/login', passport.authenticate('local'), profilingModule.signIn);
router.patch('/fcm', authenticate.verifyUser, profilingModule.setFCM);
router.patch('/passwordreset', profilingModule.passwordReset);
router.patch(
	'/profilepicture',
	authenticate.verifyUser,
	pictureHandler.uploadPicture.single('picture'),
	profilingModule.profilePicture
);

module.exports = router;
