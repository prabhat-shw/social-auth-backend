import express from 'express';
import GoogleAuthRoute from './google';
import FacebookAuthRoute from './facebook';

const router = express.Router();

router.use('/google', GoogleAuthRoute);
router.use('/facebook', FacebookAuthRoute);

export default router;
