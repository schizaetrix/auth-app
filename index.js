/*  EXPRESS SETUP  */

const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.sendFile('auth.html', {
        root : __dirname
    })
})

const port = process.env.PORT || 3000
app.listen(port , () => {
    console.log('App listening on port ' + port)
})


/*  PASSPORT SETUP  */

const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())

app.get('/success', (req, res) => {
    res.send("You have successfully logged in")
})
app.get('/error', (req, res) => {
    res.send("error logging in")
})
passport.serializeUser((user, cb) => {
  cb(null, user)
})
passport.deserializeUser((obj, cb) => {
  cb(null, obj)
})


/*  FACEBOOK AUTH  */

const FacebookStrategy = require('passport-facebook').Strategy

const FACEBOOK_APP_ID = "594127054382127"
const FACEBOOK_APP_SECRET = "7cb1be1783d79fa4dd318d69ae807eae"

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  }, 
  (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile)
  }
))

app.get('/auth/facebook',
  passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
      failureRedirect: '/error' 
    }), 
    (req, res) => {
    res.redirect('/success')
  })


/*  GITHUB AUTH  */

const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = "your app id"
const GITHUB_CLIENT_SECRET = "your app secret";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/success');
  });