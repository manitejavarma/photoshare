const bodyParser = require('body-parser'),
      express = require('express'),
      cors = require('cors'),
      app = express();

// --------------------------------------------------------------------
// APP CONFIG
// --------------------------------------------------------------------
app.use(cors())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }));

// --------------------------------------------------------------------
// ROUTES
// --------------------------------------------------------------------
const  Router = require('./routes/avatar');

app.use("/", Router);

// --------------------------------------------------------------------
// SERVER LISTENER
// --------------------------------------------------------------------

app.listen(3001, () => console.log('Server listening on port 3001!'));