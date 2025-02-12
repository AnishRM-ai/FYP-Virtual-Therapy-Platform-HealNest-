const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,  // Allows access to `req` in the callback
    state: true // Ensures CSRF protection
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
       // Extract role from state query
      let role = 'client';
     

      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        user = new User({
          username: profile.emails[0].value.split('@')[0],
          fullname: profile.displayName,
          email: profile.emails[0].value,
          oauthProvider: 'google',
          oauthId: profile.id,
          role:role,
          isVerified: true
        });

        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
