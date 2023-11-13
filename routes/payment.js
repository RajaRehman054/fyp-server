var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/auth');
var paymentController = require('../controllers/paymentController');

router.get(
	'/history',
	authenticate.verifyUser,
	paymentController.getTransactionHistory
);
router.post(
	'/payment/intent',
	authenticate.verifyUser,
	paymentController.createPayment
);

module.exports = router;
