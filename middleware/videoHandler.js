const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

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

exports.enhanceVideo = async (req, res, next) => {
	try {
		const uniqueName = `${Date.now()}-${Math.round(
			Math.random() * 1e9
		)}.mp4`;
		ffmpeg()
			.input(path.resolve(__dirname, `..${req.query.path}`))
			.videoFilter('scale=3840:2160:flags=neighbor')
			.outputOptions('-r 60')
			.outputOptions('-rc constqp')
			.outputOptions('-qp 19')
			.audioCodec('copy')
			.output(path.resolve(__dirname, `../files/enhanced/${uniqueName}`))
			.on('end', () => {
				res.download(
					path.resolve(__dirname, `../files/enhanced/${uniqueName}`),
					function (err) {
						if (err) {
							next(err);
						}
					}
				);
			})
			.on('error', err => {
				console.error('Error:', err);
			})
			.run();
	} catch (error) {
		next();
	}
};

exports.upload = multer({ storage: storage });
