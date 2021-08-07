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

 

async function GetSecret() {
    var secret = await mySecrets('arn:aws:secretsmanager:us-east-1:632772847486:secret:APISecretKey-dW1L8m')
    console.log(secret);
}

 

GetSecret();

 

var apigClientFactory = require('aws-api-gateway-client').default;

 

var apigClient = apigClientFactory.newClient({
    invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev', // REQUIRED
    apiKey: 'chZV4DzsAC6lHZDrOR1Yr3mUJQaiWaQ397b37Eog', // REQUIRED
    region: 'us-east-1' // REQUIRED
});
 