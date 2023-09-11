const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const session = require('express-session');

const app = express();

// Configure session management
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure the OAuth 2.0 strategy
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://college-auth-provider.com/oauth2/authorize',
      tokenURL: 'https://college-auth-provider.com/oauth2/token',
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret',
      callbackURL: 'http://your-website.com/auth/callback', // Adjust this URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you would typically create or update a user record in your database
      // based on the profile information received from the college's authentication system.
      // You can also store the accessToken for making authenticated API requests.

      // For simplicity, we'll store the profile in the session.
      return done(null, profile);
    }
  )
);

// Serialize user object to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user object from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Initiate the OAuth 2.0 authentication flow
app.get('/auth', passport.authenticate('oauth2'));

// Callback route after successful authentication
app.get('/auth/callback', passport.authenticate('oauth2', { failureRedirect: '/' }), (req, res) => {
  // Redirect to a protected route or dashboard
  res.redirect('/dashboard');
});

// Protected route (requires authentication)
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    // Access user data from req.user
    res.send(`Welcome, ${req.user.displayName}!`);
  } else {
    res.redirect('/');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
