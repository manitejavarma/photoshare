// Used the following resource: https://stackoverflow.com/questions/57618689/how-do-i-use-aws-secret-manager-with-nodejs-lambda
// Retrieves secret from Secret Manager
async function mySecrets(secretName) {
    // Load the AWS SDK
    var AWS = require('aws-sdk'),
        region = "us-east-1",
        secretName = "arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m",
        secret,
        decodedBinarySecret;

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: region
    });

    return new Promise((resolve,reject)=>{
        client.getSecretValue({SecretId: secretName}, function(err, data) {

            // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
            // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            // We rethrow the exception by default.
            if (err) {
                reject(err);
            }
            else {
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if ('SecretString' in data) {
                    resolve(data.SecretString);
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    resolve(buff.toString('ascii'));
                }
            }
        });
    });
}

var apigClientFactory = require('aws-api-gateway-client').default;

//Gets all users
var usersGet = async function (identificationToken) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users'

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };

    const response = await apigClient.invokeApi({}, path, 'GET', additionalParams, {})
    return response.data['Items']
};

//Gets user using id
var userGet = async (id, identificationToken) => {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}'
    params = {
        id: id
    }

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };

    var response = await apigClient.invokeApi(params, path, 'GET', additionalParams, {})
    return response.data['Item']
};

//Gets user friends
var userFriends = async (id, identificationToken) => {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}/friends'
    params = {
        id: id
    }

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };

    var response = await apigClient.invokeApi(params, path, 'GET', additionalParams, {})
    return response.data['Item']
};

//Creates a user using id.
var userCreate = async function (id, identificationToken) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users'
    var body = {
        "id": id,
        "images": [],
        "friends": []
    }

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };

    try {
        var response = await apigClient.invokeApi({}, path, 'PUT', additionalParams, body)
        // console.log(response.data)
    } catch(e) {
        // console.error(e);
    }
};

//Removes user using id.
var userRemove = async function (id, identificationToken) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}'
    var params = {
        id: id
    }

    var additionalParams = {
        headers: {
            Authorization: 'eyJraWQiOiJySEVpOWM5Mzc1bHE1VHgrQjM4bDJkaFZEUWZFWk1RemxyaGUxd1wvdUpXbz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoic0xMenk4ZDdFdmlaM0Y3RW11cG5DUSIsInN1YiI6ImYzOWYyZWE3LTRjYjgtNDAwNy1hMjJkLWQyOWRiYmNkZjlmMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9kS0RDbTVCSU0iLCJjb2duaXRvOnVzZXJuYW1lIjoiYXJqdW4iLCJvcmlnaW5fanRpIjoiOTM5YTgwYjktMTc4Mi00ZDU3LTk4MDItM2QzNzg4MjI4YWJhIiwiYXVkIjoiMWU4M2xldWRpbHM3MmhmNGVmNnZhOWNiY3QiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYyODMwMjk5NiwiZXhwIjoxNjI4MzA2NTk2LCJpYXQiOjE2MjgzMDI5OTYsImp0aSI6IjFiMWUyNDhhLTQyMjctNDEwOC05Y2E4LTQzOWU1NjYyMDg0ZiIsImVtYWlsIjoiYXJqdW4uYkBkYWwuY2EifQ.L65tuVAranf-Psy8uvefdi6orXeuTHNTbzDZSF79SRTjjygmN-NeeyHKjAPP7lp_gg_rauyvKjvbvtLeNiY-CZgzTvU6Gld8K4CRpAZNVlVvq2CtjsD9UU_7g8EYX7E9MRuzMTZcDbxknrScTYJSRJQMNOZklhCCZDc_P2FU0qVvLoUeXP32m4cEAxTgBWq4lcMrHANBRN9Hr94WRN97Nu9pAN95KRidhZ2GJ3l4Reyl0FjTSn553OfWlvCMpNlxnu-c5yd0WrjVvtSavk8_dco9F5t3yWXyGSMVnrlFGpheslZrGrCgpLg81kJp6HorxL9FCxi8xh0hmVGxT8kA3g'   
        }
    }

    var response = await apigClient.invokeApi(params, path, 'DELETE', additionalParams, {})
    console.log(response.data)
};
//Gets image using id.
var imagesGet = async function (id, token) {
    const images = await (async () => {
        const user = await userGet(id, token)
        const images = user['images']
        return images
    })()
    return images
}

//Gets all users
var imagesGetAll = async function (identificationToken) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/images'

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };

    const response = await apigClient.invokeApi({}, path, 'GET', additionalParams, {})
    return response.data['Items']
};

//Adds an image to user using userid, imageid
var imageCreate = async function (user, id, object, identificationToken) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}/image/{object}'
    params = {
        id: id,
        object: object
    }

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };
    var response = await apigClient.invokeApi(params, path, 'POST', additionalParams, {})
    //console.log(response.data)
    console.log(user)
    var path = '/images'
    const body = {
        image: object,
        user: user
    }
    var response = await apigClient.invokeApi({}, path, 'PUT', additionalParams, body)
    // console.log(response.data)
}

//Remove image from user using userid, imageid
var imageRemove = async function (id, object, identificationToken) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}/image'

    const params = {
        id: id
    }

    const body = {
        "index": await (async () => {
            const user = await userGet(id)
            const images = user['images']
            console.log(images)
            return images.indexOf(object)
        })()
    }

    var additionalParams = {
        headers: {
            Authorization: identificationToken
        }
    };

    var response = await apigClient.invokeApi(params, path, 'DELETE', additionalParams, body)
    console.log(response.data)
}

//Testing

// usersGet().then(value => {
//     console.log("All users\n", value)
// })

// userGet("cc").then(value => {
//     console.log("User with id\n", value, "\n")
// })

// userCreate("pp")
// usersGet().then(value => {
//     console.log("\nAll users\n", value, "\n")
// })

// userRemove("pp")
// usersGet().then(value => {
//     console.log("\nAll users\n", value, "\n")
// })

//userCreate("bb")
// imageCreate("cc", "xas")
//imageRemove("cc", "xas")

module.exports = { imageCreate, imageRemove, userCreate, userGet, userRemove, usersGet, imagesGet, imagesGetAll, userFriends }