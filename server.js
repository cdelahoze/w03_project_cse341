const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');
const errorMiddleware = require('./middleware/errors')
require("dotenv").config();
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;

const port = process.env.PORT || 8080;
const app = express();


app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  // This is the basic express session({...}) Initialization.
  .use(passport.initialize())
  // init passport on every route call.
  .use(passport.session())
  // allow passport to use "express session"

  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use(cors({ methods:['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
  .use(cors({ origin: '*'}))
  .use('/', require('./routes'));

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
  // User find Or create({ githubId: profile.Id}), function (err, user) {
    return done(null, profile);
  // })
  }
));

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayNanme}` : "Logged Out")});

app.get('/github/callback', passport.authenticate('github', {
   failureRedirect: '/api-docs', session: false}), 
   (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

app.get('/login', passport.authenticate('github'), (req, res) => {});

app.get('/logaout', function(req, res, next) {
	req.logout(function(err) {
	if (err) { return next(err); }
	res.redirect('/');
});
});



app.use(errorMiddleware)
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

mongodb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port);
      console.log(`Connected to Database and listening on ${port}`);
    }
  });


