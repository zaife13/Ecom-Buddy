const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const User = require('../models/userModel');
const HttpError = require('../utils/httpError');
const { createUserWithToken } = require('./authController');
const catchAsync = require('../utils/catchAsync');

const passportConfig = {
  clientID: config.get('authentication.google.clientId'),
  clientSecret: config.get('authentication.google.clientSecret'),
  callbackURL: 'http://localhost:3000/ecomm/users/login/google/redirect',
};

const saveUserInDB = async (profile) => {
  let newUser;
  newUser = new User({
    name: profile.displayName,
    email: profile.emails[0].value,
    providers: [{ provider: profile.provider, id: profile.id }],
  });

  try {
    await newUser.save({ validateBeforeSave: false });
  } catch (error) {}

  return newUser;
};

if (passportConfig.clientID) {
  passport.use(
    new passportGoogle.OAuth2Strategy(passportConfig, async function (
      request,
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      console.log(profile);

      let existingUser;

      try {
        existingUser = await User.findOne({ email: profile.emails[0].value });
      } catch (error) {
        return done('Something went wrong. Could not authenticate with google.M');
      }

      if (!existingUser) {
        // create a new user if there is none signed in before with this google email.
        const newUser = await saveUserInDB(profile);
        console.log(newUser);
        existingUser = newUser;

        return done(null, existingUser);

        //
      } else {
        let isAlreadyGoogleUser;

        if (existingUser.providers.length) {
          existingUser.providers.map((providerObj) => {
            // check if user has already signed with google. If yes then the app will not add the google record again in the db.
            if (providerObj.provider === 'google') {
              isAlreadyGoogleUser = true;
            }
          });
        }

        // if there is no signed in with google before. So we will add the provider = google and the google userId to this user.
        if (!isAlreadyGoogleUser) {
          existingUser.providers.push({
            provider: profile.provider,
            id: profile.id,
          });
          try {
            await existingUser.save({ validateBeforeSave: false });
          } catch (error) {
            return done('Something went wrong. Could not authenticate with google.Z');
          }
        }
        return done(null, existingUser);
      }
    })
  );
}
