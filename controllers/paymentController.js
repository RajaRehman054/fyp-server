require('dotenv').config();
var asyncHandler = require('../middleware/asyncHandler');
var stripe = require('stripe')(process.env.STRIPE_KEY);

var Transaction = require('../models/transaction');

exports.createPayment = asyncHandler(async (req, res, next) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: req.body.amount,
		currency: 'usd',
		automatic_payment_methods: {
			enabled: true,
		},
	});
	res.json({
		clientSecret: paymentIntent.client_secret,
	});
});

exports.getTransactionHistory = asyncHandler(async (req, res, next) => {
	const history = await Transaction.find({ user: req.user._id });
	res.status(200).json(history);
});
