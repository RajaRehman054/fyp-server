const cron = require('node-cron');
const pushNotification = require('../utils/pushNotifications');
const axios = require('axios');

const Bid = require('../models/bidding');
const Video = require('../models/video');
const User = require('../models/user');
const Posting = require('../models/posting');

exports.expireBid = async () => {
	cron.schedule('* * * * *', async () => {
		const totalBids = await Bid.find({
			expired: false,
		});

		totalBids.forEach(async document => {
			let currentTime = Date.now();
			if (document.expires < currentTime) {
				await Bid.findByIdAndUpdate(document._id, { expired: true });
				await User.findByIdAndUpdate(document.original_owner, {
					$inc: { wallet: document.current_amount, sales: 1 },
				});
				await User.findByIdAndUpdate(document.current_highest, {
					$inc: { bought: 1 },
				});
			}
		});
	});
};

exports.jobChecker = async () => {
	cron.schedule('* * * * *', async () => {
		const postings = await Posting.find({ ended: false });

		postings.forEach(async document => {
			let currentTime = Date.now();
			if (document.time < currentTime) {
				await Posting.findByIdAndUpdate(document._id, {
					ended: true,
					receiving: false,
				});
				document.requests.forEach(async element => {
					await User.findByIdAndUpdate(element.user, {
						hirer: null,
					});
				});
			}
		});
	});
};

exports.sendRecommendations = async () => {
	cron.schedule('*/30 * * * * *', async () => {
		const threeHoursAgo = new Date();
		threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
		const users = await User.find({});
		const videos = await Video.find({
			bought: false,
			created_on: { $gte: threeHoursAgo },
		});
		if (videos.length > 5) {
			let array = [];
			users.forEach(user => {
				if (user.fcm !== '') {
					array.push(user.fcm);
				}
			});
			await pushNotification.recommendationNotification(array);
		}
	});
};

exports.filterUploadedVideos = async () => {
	cron.schedule('*/30 * * * * *', async () => {
		const videos = await Video.find({
			checked: false,
		});
		videos.forEach(async document => {
			const formData = new FormData();
			formData.append('file', videoStream);

			const response = await axios.post('YOUR_ENDPOINT_URL', formData, {
				headers: {
					'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
					// Add any other headers if needed
				},
			});
		});
	});
};
