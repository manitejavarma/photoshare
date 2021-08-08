const { imageCreate, imagesGet, imagesGetAll, userFriends } = require("./apig-service.js")
const imageThumbnail = require('image-thumbnail');

const upload = require('./middleware'),
	express = require('express'),
	router = express.Router();


var fs = require("fs");

router.post('/upload', upload.single('file'), async (req, res) => {
	const image = req.file;
	sub = req.headers.sub
	user = req.headers.user
	identificationToken = req.headers.token

	const fileContent = new Buffer(image.buffer, 'base64')
	//aws sdk starts here
	const AWS = require('aws-sdk');

	/* Bucket that contains the original Image.
	Uploading any object to this bucket will trigger a lamdba function to create a thumbnail in another bucket */
	const BUCKET_NAME = 'photosharingcloud';
	const s3 = new AWS.S3();

	const currentTimeStamp = Date.now()

	const params = {
		Bucket: BUCKET_NAME,
		Key: currentTimeStamp + image.originalname,
		Body: fileContent
	};

	s3.putObject(params, function (err, data) {
		if (err) {
			console.log("Error: ", err);
		} else {
			// console.log("Here is the data after puting in S3 bucket", data);
			try {
				imageCreate(user, sub, currentTimeStamp + image.originalname, identificationToken)

				let options = { percentage: 50 }
				const thumbnail = imageThumbnail(Buffer.from(fileContent).toString('base64'), options);
				thumbnail.then(function (result) {
					var responseJSON = new Array();
					var message = new Object();
					message.status = "Success";
					var imageObject = new Object();
					imageObject.fileName = currentTimeStamp + image.originalname;
					let fileExtension = imageObject.fileName.split('.').pop()
					imageObject.data = 'data:image/' + fileExtension + ';base64,' + Buffer.from(result).toString('base64');
					responseJSON.push(message);
					responseJSON.push(imageObject);
					res.status(200).json(responseJSON)
				})


			} catch (err) {
				console.log(err);
				res.status(500).json({ message: err })
			}
		}
	});
});


var ImageDataList = new Array;

router.get('/getFriends', async (req, res) => {
	const sub = req.query.sub
	const identificationToken = req.query.token
	const friendsList = await (async (s) => {
		const friends = await userFriends(sub, identificationToken)
		return friends
	})()

	try {
		console.log(friendsList);
		res.send(friendsList);
		console.log(res);
	} catch (err) {
		console.log(err);
	}
});

router.get('/getImages', async (req, res) => {

	const sub = req.query.sub
	const identificationToken = req.query.token
	const imagesList = await (async (s) => {
		const images = await imagesGet(sub, identificationToken)
		return images
	})()
	const AWS = require('aws-sdk');
	// Get all thumbnails from this bucket
	const BUCKET_NAME = 'photosharingcloud-resized';
	const s3 = new AWS.S3();

	var getObject = function (keyFile) {
		return new Promise(function (success, reject) {
			s3.getObject(
				{ Bucket: BUCKET_NAME, Key: keyFile },
				function (error, data) {
					if (error) {
						// if(error.code != "NoSuchKey"){
						// reject(error);
						// }
						reject(error);
					} else {
						success(data);
					}
				}
			);
		});
	}

	var promises = [];
	var fileContentList = new Array();



	for (i = 0; i < imagesList.length; i++) {
		promises.push(getObject(unescape(imagesList[i])));
	}

	Promise.all(promises)
		.then(function (results) {
			var fetchedImagesInJSONFormat = new Array();
			var message = new Object();
			message.status = "Success";
			fetchedImagesInJSONFormat.push(message);
			for (var index in results) {
				var data = results[index];
				fileContentList.push(data.Body.toString())
				var image = new Object();
				image.fileName = imagesList[index];
				let fileExtension = imagesList[index].split('.').pop()
				image.data = 'data:image/' + fileExtension + ';base64,' + Buffer.from(data.Body).toString('base64');
				fetchedImagesInJSONFormat.push(image);
			}
			res.send(fetchedImagesInJSONFormat);
		})
		.catch(function (err) {
			console.log(err);
		});

});


//Just get one Image!
router.get('/getImage', async (req, res) => {

	const fileName = req.query.fileName
	const AWS = require('aws-sdk');
	// From original Bucket
	const BUCKET_NAME = 'photosharingcloud';
	const s3 = new AWS.S3();

	var getObject = function (keyFile) {
		return new Promise(function (success, reject) {
			s3.getObject(
				{ Bucket: BUCKET_NAME, Key: keyFile },
				function (error, data) {
					if (error) {
						reject(error);
					} else {
						success(data);
					}
				}
			);
		});
	}

	getObject(unescape(fileName))
		.then(function (result) {
			var fetchedImagesInJSONFormat = new Array();
			var message = new Object();
			message.status = "Success";
			fetchedImagesInJSONFormat.push(message);
			var data = result;
			var image = new Object();
			image.fileName = fileName;
			let fileExtension = fileName.split('.').pop()
			image.data = 'data:image/' + fileExtension + ';base64,' + Buffer.from(data.Body).toString('base64');
			fetchedImagesInJSONFormat.push(image);

			res.send(fetchedImagesInJSONFormat);
		})
		.catch(function (err) {
			console.log(err);
		});

});

router.get('/getAllImages', async (req, res) => {

	const identificationToken = req.query.token
	const imageList = await (async () => {
		const images = await imagesGetAll(identificationToken)
		return images
	})()

	imageList.sort(function(a, b) {
		return a.image > b.image ? -1 : a.image < b.image ? 1 : 0
	})

	const imagesList = imageList.map(({ image }) => image)
	const userList = imageList.map(({ user }) => user)
	
	
	const AWS = require('aws-sdk');
	// Get all thumbnails from this bucket
	const BUCKET_NAME = 'photosharingcloud-resized';
	const s3 = new AWS.S3();

	var getObject = function (keyFile) {
		return new Promise(function (success, reject) {
			s3.getObject(
				{ Bucket: BUCKET_NAME, Key: keyFile },
				function (error, data) {
					if (error) {
						// if(error.code != "NoSuchKey"){
						// reject(error);
						// }
						reject(error);
					} else {
						success(data);
					}
				}
			);
		});
	}

	var promises = [];
	var fileContentList = new Array();



	for (i = 0; i < imagesList.length; i++) {
		promises.push(getObject(unescape(imagesList[i])));
	}

	Promise.all(promises)
		.then(function (results) {
			var fetchedImagesInJSONFormat = new Array();
			var message = new Object();
			message.status = "Success";
			fetchedImagesInJSONFormat.push(message);
			for (var index in results) {
				var data = results[index];
				fileContentList.push(data.Body.toString())
				var image = new Object();
				image.fileName = imagesList[index];
				image.by = userList[index];
				let fileExtension = imagesList[index].split('.').pop()
				image.data = 'data:image/' + fileExtension + ';base64,' + Buffer.from(data.Body).toString('base64');
				fetchedImagesInJSONFormat.push(image);
			}
			res.send(fetchedImagesInJSONFormat);
		})
		.catch(function (err) {
			console.log(err);
		});

});




module.exports = router;
