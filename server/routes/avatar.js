const upload = require('./middleware'),
    express = require('express'),
    router = express.Router();


var fs = require("fs");

router.post('/upload', upload.single('file'), async (req, res) => {
    const image = req.file;


    const fileContent = new Buffer(image.buffer, 'base64')

    //aws sdk starts here

    const AWS = require('aws-sdk');

    // The name of the bucket that you have created
    const BUCKET_NAME = 'photosharingcloud';
    const s3 = new AWS.S3();

    const params = {
        Bucket: BUCKET_NAME,
        Key: image.originalname,
        Body: fileContent
    };


    s3.putObject(params, function (err, data) {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Here is the data after puting in S3 bucket",data);
        }
    });
});

const imagesList = ["download.png", "download.jpg"];

var ImageDataList=new Array;


	
	router.get('/getImages', async (req, res) => {
		
		const AWS = require('aws-sdk');
					// The name of the bucket that you have created
		const BUCKET_NAME = 'photosharingcloud';
		const s3 = new AWS.S3();
		
		var getObject = function(keyFile) {
			return new Promise(function(success, reject) {
				s3.getObject(
					{ Bucket: BUCKET_NAME, Key: keyFile },
					function (error, data) {
						if(error) {
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
			promises.push(getObject(imagesList[i]));
		}

		Promise.all(promises)
		.then(function(results) {
			var fetchedImagesInJSONFormat = new Array();
			var message = new Object();
			message.status = "Success";
			fetchedImagesInJSONFormat.push(message);
			for(var index in results) {
				var data = results[index];
				fileContentList.push(data.Body.toString());
				
				var image = new Object();
				image.fileName = imagesList[index];
				image.data = 'data:image/png;base64,' + Buffer.from(data.Body).toString('base64');
				
				fetchedImagesInJSONFormat.push(image);
			}
			// continue your process here
		
			/* jsonResponse = JSON.stringify(fetchedImagesInJSONFormat);
			res.send(jsonResponse); */
			res.send(fetchedImagesInJSONFormat);
		})
		.catch(function(err) {
			console.log(err);
			return err;
		});
		
		
		
		
		/* //aws sdk starts here
		
		const AWS = require('aws-sdk');
					// The name of the bucket that you have created
		const BUCKET_NAME = 'photosharingcloud';
		const s3 = new AWS.S3();
		
		const getImages = (value, index, array) => {
			

			console.log("In Get Images function")
			var getParams = {
				Bucket: BUCKET_NAME, // your bucket name,
				Key: value // path to the object you're looking for
			}

			s3.getObject(getParams, function (err, data) {
				// Handle any error and exit
				if (err){		
					console.log(err);
					return err;
				}
				console.log(data.Body);
				ImageDataList.push(data.Body)
				// No error happened
				// Convert Body from a Buffer to a String
				
				//let objectData = Buffer.from(data.Body).toString('utf-8'); // Use the encoding necessary
				//res.send(objectData);
			});
			console.log(ImageDataList.length)
		}
		
		imagesList.forEach(getImages);
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		res.write(ImageDataList[0], 'binary');
		res.end(null, 'binary'); */
	});




module.exports = router;