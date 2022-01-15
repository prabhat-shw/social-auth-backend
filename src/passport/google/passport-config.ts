/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { SCOPES } from '@src/configs/google';
import { GoogleUser } from './types';

const { SERVER_ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${SERVER_ROOT_URL}/${GOOGLE_REDIRECT_URI}`,
      scope: SCOPES,
    },
    (accessToken: string, refreshToken: string, profile, cb) => {
      const {
        id,
        _json: { email, email_verified, family_name, given_name, locale, name, picture },
      } = profile;
      const user: GoogleUser = {
        id,
        email: email as string,
        verified_email: email_verified === 'true',
        name: name as string,
        given_name: given_name as string,
        family_name: family_name as string,
        picture: picture as string,
        locale: locale as string,
      };
      cb(null, user);
    }
  )
);
