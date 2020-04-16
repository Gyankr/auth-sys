//include express
const express = require('express');

//include express layouts
const expressLayouts = require('express-ejs-layouts');

//port on which the server should listen
const port = 8000;

//include path module
const path = require('path');

//include database
const db = require('./config/mongoose');

//create express application
const app = express();

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);
//middleware to parse form data
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//set assets path
app.use(express.static('./assets'));

//set view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './views');

//use express layouts
app.use(expressLayouts);

app.use(session({
  name: 'Authentication System',
  secret: 'secret-key',
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: (1000 * 60 * 100)
  },
  store: new MongoStore(
      {
          mongooseConnection: db,
          autoRemove: 'disabled'
      },
      function(err){
          console.log(err | 'connect-mongo setup ok');
      }
  )
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//redirect all urls to routes index.js
app.use('/', require('./routes'));

//start the express on specefied port
app.listen(port, function(err){
  if(err){
    console.log(`Error in starting the server: ${err}`);
    return;
  }
  console.log(`Server up and running on port: ${port}`);
})