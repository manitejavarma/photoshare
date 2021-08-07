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

//Gets all users
var usersGet = async function () {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users'
    const response = await apigClient.invokeApi({}, path, 'GET', {}, {})
    return response.data['Items']
};

//Gets user using id
var userGet = async (id) => {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}'
    params = {
        id: id
    }
    var response = await apigClient.invokeApi(params, path, 'GET', {}, {})
    return response.data['Item']
};
//Creates a user using id.
var userCreate = async function (id) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users'
    body = {
        "id": id,
        "images": [],
        "friends": []
    }
    try {
        var response = await apigClient.invokeApi({}, path, 'PUT', {}, body)
        console.log(response.data)
    } catch(e) {
        console.error(e);
    }
};

//Removes user using id.
var userRemove = async function (id) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/users/{id}'
    params = {
        id: id
    }
    var response = await apigClient.invokeApi(params, path, 'DELETE', {}, {})
    console.log(response.data)
};
//Gets image using id.
var imagesGet = async function (id) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    const images = await (async () => {
        const user = await userGet(id)
        const images = user['images']
        console.log(images)
        return images
    })()
    return images
}

//Gets all users
var imagesGetAll = async function () {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
    var apigClient = apigClientFactory.newClient({
        invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
        apiKey: API_KEY, // REQUIRED
        region: 'us-east-1' // REQUIRED
    });

    var path = '/images'
    const response = await apigClient.invokeApi({}, path, 'GET', {}, {})
    return response.data['Items']
};

//Adds an image to user using userid, imageid
var imageCreate = async function (user, id, object) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
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
    var response = await apigClient.invokeApi(params, path, 'POST', {}, {})
    console.log(response.data)
    console.log(user)
    var path = '/images'
    const body = {
        image: object,
        user: user
    }
    var response = await apigClient.invokeApi({}, path, 'PUT', {}, body)
    console.log(response.data)
}

//Remove image from user using userid, imageid
var imageRemove = async function (id, object) {
    // Get api key from secret manager
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    secret = JSON.parse(secret)
    var API_KEY = secret['APISecretKey']

    var apigClientFactory = require('aws-api-gateway-client').default;
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
    var response = await apigClient.invokeApi(params, path, 'DELETE', {}, body)
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

module.exports = { imageCreate, imageRemove, userCreate, userGet, userRemove, usersGet, imagesGet, imagesGetAll }