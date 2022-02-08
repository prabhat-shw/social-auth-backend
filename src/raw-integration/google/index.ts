import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getGoogleAuthURL, getTokens, getUser } from './helper';

const { JWT_SECRET, COOKIE_NAME, CLIENT_ROOT_URL, NODE_ENV } = process.env;

const router = express.Router();

// Getting login URL
router.get('/', (req: Request, res: Response) => {
  return res.send(getGoogleAuthURL());
});

// Getting the user from Google with the code
router.get(`/callback`, async (req: Request, res: Response) => {
  const code = req.query.code as string;

  // eslint-disable-next-line camelcase
  const { access_token } = await getTokens(code);

  // Fetch the user's profile with the access token and bearer
  /* 
    {
      id: '109583184547085049212',
      email: 'sonu.shw77@gmail.com',
      verified_email: true,
      name: 'Prabhat Shaw',
      given_name: 'Prabhat',
      family_name: 'Shaw',
      picture: 'https://lh3.googleusercontent.com/a-/AOh14GizcGhwfjav6N7OlQoPgZ7qnztHh9LdTPevc79Y=s96-c',
      locale: 'en'
    }
  */
  const googleUser = await getUser(access_token);
  const token = jwt.sign(googleUser, JWT_SECRET as string);
  // this can be extracted out to a common place. keeping here for simplicity
  res.cookie(COOKIE_NAME as string, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: NODE_ENV !== 'development',
  });

  res.redirect(CLIENT_ROOT_URL as string);
});

// Getting the current user
// router.get('/auth/me', (req, res) => {
//   console.log('get me');
//   try {
//     const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
//     console.log('decoded', decoded);
//     return res.send(decoded);
//   } catch (err) {
//     console.log(err);
//     return res.send(null);
//   }
// });

export default router;
