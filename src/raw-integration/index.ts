import express from 'express';
import GoogleAuthRoute from './google';
import FacebookAuthRoute from './facebook';
import GithubAuthRoute from './github';

const router = express.Router();

router.use('/google', GoogleAuthRoute);
router.use('/facebook', FacebookAuthRoute);
router.use('/github', GithubAuthRoute);

export default router;
