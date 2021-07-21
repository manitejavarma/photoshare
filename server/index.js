const { userCreate } = require("./routes/apig-service.js")


const bodyParser = require('body-parser'),
      express = require('express'),
      cors = require('cors'),
      app = express();

// --------------------------------------------------------------------
// APP CONFIG
// --------------------------------------------------------------------
app.use(cors())
   .use(express.json())
   .use(express.urlencoded({ extended: true }));

// --------------------------------------------------------------------
// ROUTES
// --------------------------------------------------------------------
const  Router = require('./routes/avatar');

app.use("/", Router);

app.post('/users', async (req, res, next) => {
   const sub = req.body['sub']
   try {
      userCreate(sub)
      res.status(200).json()
   } catch (err) {
      res.status(500).json({ message: err })
   }
});

// --------------------------------------------------------------------
// SERVER LISTENER 
// --------------------------------------------------------------------

app.listen(3001, () => console.log('Server listening on port 3001!'));