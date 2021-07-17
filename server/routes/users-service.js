var apigClientFactory = require('aws-api-gateway-client').default;

config = {invokeUrl:'https://3xxda0js4d.execute-api.us-east-1.amazonaws.com/dev'}
var apigClient = apigClientFactory.newClient(config);




//Gets all users
var usersGet = async function () {
    var path = '/users'
    const response = await apigClient.invokeApi({}, path, 'GET', {}, {})
    return response.data['Items']
};

//Gets user using id
var userGet = async (id) => {
    var path = '/users/{id}'
    params = {
        id: id
    }
    var response = await apigClient.invokeApi(params, path, 'GET', {}, {})
    return response.data['Item']
};
//Creates a user using id.
var userCreate = async function (id) {
    var path = '/users'
    body = {
        "id": id,
        "images": []
    }
    var response = await apigClient.invokeApi({}, path, 'PUT', {}, body)
    console.log(response.data)
};

//Removes user using id.
var userRemove = async function (id) {
    var path = '/users/{id}'
    params = {
        id: id
    }
    var response = await apigClient.invokeApi(params, path, 'DELETE', {}, {})
    console.log(response.data)
};
//Gets image using id.
var imagesGet = async function (id) {
    const images = await (async () => {
        const user = await userGet(id)
        const img = user['images']
        console.log(img)
        return img
    })()
    return images
}

//Adds an image to user using userid, imageid
var imageCreate = async function (id, object) {
    var path = '/users/{id}/image/{object}'
    params = {
        id: id,
        object: object
    }
    var response = await apigClient.invokeApi(params, path, 'POST', {}, {})
    console.log(response.data)
}

//Remove image from user using userid, imageid
var imageRemove = async function (id, object) {
    var path = '/users/{id}/image'

    const params = {
        id: id
    }

    const body = {
        "index": await (async () => {
            const user = await userGet("cc")
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

