import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getGithubAuthURL, getTokens, getUser } from './helper';

const { JWT_SECRET, COOKIE_NAME, CLIENT_ROOT_URL } = process.env;

const router = express.Router();

// Getting login URL
router.get('/', (req: Request, res: Response) => {
  return res.send(getGithubAuthURL());
});

// Getting the user from Google with the code
router.get(`/callback`, async (req: Request, res: Response) => {
  const code = req.query.code as string;
  // eslint-disable-next-line camelcase
  const { access_token } = await getTokens(code);
  // Fetch the user's profile with the access token and bearer

  const githubUser = await getUser(access_token);
  const token = jwt.sign(githubUser, JWT_SECRET as string);

  res.cookie(COOKIE_NAME as string, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.redirect(CLIENT_ROOT_URL as string);
});

export default router;
