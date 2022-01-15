/* eslint-disable camelcase */
import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { GoogleUser } from './types';

import('./passport-config');

const { JWT_SECRET, COOKIE_NAME, CLIENT_ROOT_URL } = process.env;

const router = express.Router();

router.get('/', passport.authenticate('google'));

router.get(`/callback`, passport.authenticate('google'), (req: Request, res: Response) => {
  const token = jwt.sign(req.user as GoogleUser, JWT_SECRET as string);

  res.cookie(COOKIE_NAME as string, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.redirect(CLIENT_ROOT_URL as string);
});

export default router;
