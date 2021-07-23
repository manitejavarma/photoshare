const { imageCreate, imagesGet } = require("./apig-service.js")
const imageThumbnail = require('image-thumbnail');

const upload = require('./middleware'),
    express = require('express'),
    router = express.Router();


var fs = require("fs");

router.post('/upload', upload.single('file'), async (req, res) => {
    const image = req.file;
	sub = req.headers.sub

	const fileContent = new Buffer(image.buffer, 'base64')
    //aws sdk starts here

    const AWS = require('aws-sdk');

    // The name of the bucket that you have created
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
            console.log("Here is the data after puting in S3 bucket",data);
			try {
				imageCreate(sub, currentTimeStamp + image.originalname)
				
				let options = { percentage: 50}
				const thumbnail = imageThumbnail(Buffer.from(fileContent).toString('base64'),options);
				thumbnail.then(function(result) {
					var responseJSON = new Array();
					var message = new Object();
					message.status = "Success";
					var imageObject = new Object();
					imageObject.fileName = currentTimeStamp + image.originalname;
					let fileExtension = imageObject.fileName.split('.').pop()
					imageObject.data = 'data:image/'+fileExtension +';base64,' + Buffer.from(result).toString('base64');
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


var ImageDataList=new Array;


	
	router.get('/getImages', async (req, res) => {
		
		const sub = req.query.sub
		const imagesList = await (async (s) => {
			const images = await imagesGet(sub)
			return images
		})()
		const AWS = require('aws-sdk');
					// The name of the bucket that you have created
		const BUCKET_NAME = 'photosharingcloud-resized';
		const s3 = new AWS.S3();
		
		var getObject = function(keyFile) {
			return new Promise(function(success, reject) {
				s3.getObject(
					{ Bucket: BUCKET_NAME, Key: keyFile },
					function (error, data) {
						if(error) {
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
		
	
		
		for(i=0; i<imagesList.length;i++){
			promises.push(getObject(unescape(imagesList[i])));
		}

		Promise.all(promises)
		.then(function(results) {
			var fetchedImagesInJSONFormat = new Array();
			var message = new Object();
			message.status = "Success";
			fetchedImagesInJSONFormat.push(message);
			for(var index in results) {
				var data = results[index];
				fileContentList.push(data.Body.toString())
				var image = new Object();
				image.fileName = imagesList[index];
				let fileExtension = imagesList[index].split('.').pop()
				image.data = 'data:image/'+fileExtension +';base64,' + Buffer.from(data.Body).toString('base64');
				fetchedImagesInJSONFormat.push(image);
			}
			// continue your process here
		
			/* jsonResponse = JSON.stringify(fetchedImagesInJSONFormat);
			res.send(jsonResponse); */
			res.send(fetchedImagesInJSONFormat);
		})
		.catch(function(err) {
			console.log(err);
		});
	
	});




module.exports = router;