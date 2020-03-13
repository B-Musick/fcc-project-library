'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var helmet      = require('helmet');
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
var app = express();
let methodOverride = require('method-override');

let Book = require('./models/Book');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
// Helmet internet security
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

// Used on the anchor which is calling the DELETE route '?_method=DELETE'
app.use(methodOverride("_method")); // For DELETE method
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/fcc_project_library', { useNewUrlParser: true, useUnifiedTopology: true }); 
// CONNECT TO MONGODB ATLAS DATABASE - pass URI key to connect
// mongoose.connect(process.env.DATABASE, {
//   userNewUrlParser: true,
//   useCreateIndex: true
// }).then(() => {
//   console.log("Connected to DB!");
// }).catch(err => {
//   console.log("Error: ", err.message);
// });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    Book.find({},(err,books)=>{
      err ? res.json(err):res.render('index',{books});

    })
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
