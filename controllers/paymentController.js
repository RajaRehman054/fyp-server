require('dotenv').config();
var asyncHandler = require('../middleware/asyncHandler');
var stripe = require('stripe')(process.env.STRIPE_KEY);

var Transaction = require('../models/transaction');

exports.createPayment = asyncHandler(async (req, res, next) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {},
					unit_amount: req.params.amount,
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: `${process.env.CLIENT_URL}/checkoutsuccess`,
		cancel_url: `${process.env.CLIENT_URL}/bids`,
	});

	res.status(200).json({ url: session.url });
});

exports.getTransactionHistory = asyncHandler(async (req, res, next) => {
	const history = await Transaction.find({ user: req.user._id });
	res.status(200).json(history);
});
