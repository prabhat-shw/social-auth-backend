import express from 'express';
import passport from 'passport';
import GoogleAuthRoute from './google';

const router = express.Router();

router.use(passport.initialize());

router.use('/google', GoogleAuthRoute);

export default router;
