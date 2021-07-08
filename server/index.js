const express = require('express')
const path = require('path')

const app = express()

app.get('/testAPI', (req, res) => {
    res.send('This is the backend')
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('Server listening on ${PORT}')
})