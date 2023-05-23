var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
var fs = require('fs');
var path = require('path');

var asyncHandler = require('../middleware/asyncHandler');
var Video = require('../models/video');

exports.createVideo = asyncHandler(async (req, res, next) => {
	const video = await Video.create({
		owner: req.user._id,
		description: req.query.desc,
		tags: req.headers.tags,
	});
	req.video = video;
	next();
});

exports.uploadVideo = asyncHandler(async (req, res) => {
	await Video.findByIdAndUpdate(req.video._id, {
		path: req.source,
		thumbnail: req.thumbnail,
	});
	res.status(201).json();
});

exports.getVideo = (req, res, next) => {
	try {
		const videoPath = path.resolve(__dirname, `../${req.query.path}`);
		const videoSize = fs.statSync(videoPath).size;
		if (req.headers.range) {
			const range = req.headers.range;
			const chunksize = 1 * 1e6;
			const start = Number(range.replace(/\D/g, ''));
			const end = Math.min(start + chunksize, videoSize - 1);
			const contentLength = end - start + 1;
			const headers = {
				'Content-Range': `bytes ${start}-${end}/${videoSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': contentLength,
				'Content-Type': 'video/mp4',
			};
			res.writeHead(206, headers);
			const stream = fs.createReadStream(videoPath, {
				start,
				end,
			});
			stream.pipe(res);
		} else {
			const headers = {
				'Content-Length': videoSize,
				'Content-Type': 'video/mp4',
			};
			res.writeHead(200, headers);
			fs.createReadStream(videoPath).pipe(res);
		}
	} catch (error) {
		next(error);
	}
};

exports.getVideos = asyncHandler(async (req, res) => {
	const videos = await Video.find({}).populate('owner');
	res.status(201).json(videos);
});

exports.getMyVideos = asyncHandler(async (req, res) => {
	const videos = await Video.find({ owner: req.user._id }).populate('owner');
	res.status(201).json(videos);
});

exports.getMyThumbnails = asyncHandler(async (req, res, next) => {
	res.sendFile(path.join(__dirname, `..${req.query.path}`), err => {
		if (err) {
			next(err);
		}
	});
});

// for (let j = 0; j < videos.length; j++) {
// 	date = new Date(videos[j].created_on);
// 	year = date.getFullYear();
// 	month = date.getMonth() + 1;
// 	dt = date.getDate();
// 	if (dt < 10) {
// 		dt = '0' + dt;
// 	}
// 	if (month < 10) {
// 		month = '0' + month;
// 	}
// 	videos[j].date = year + '-' + month + '-' + dt;
// }
