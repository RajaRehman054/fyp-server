const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.resolve(__dirname, '../files/videos'));
	},
	filename: async (req, file, cb) => {
		cb(null, req.video._id.toString() + '.mp4');
		req.source = `/files/videos/${req.video._id.toString()}.mp4`;
		req.thumbnail = `/files/thumbnails/${req.video._id.toString()}.png`;
	},
});

exports.upload = multer({ storage: storage });
