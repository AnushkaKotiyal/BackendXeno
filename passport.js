const passport = require('passport');
const User=require('./Models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://backendxeno.onrender.com/user/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user in your DB here
    let user = await User.findOne({ email: profile.emails?.[0]?.value });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
