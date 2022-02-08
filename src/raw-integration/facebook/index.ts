import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getFacebookAuthURL, getTokens, getUser } from './helper';

const { JWT_SECRET, COOKIE_NAME, CLIENT_ROOT_URL, NODE_ENV } = process.env;

const router = express.Router();

// Getting login URL
router.get('/', (req: Request, res: Response) => {
  return res.send(getFacebookAuthURL());
});

// Getting the user from Google with the code
router.get(`/callback`, async (req: Request, res: Response) => {
  try {
    // Handles case where user clicks on `Cancel` on login popup
    if (req.query.error) {
      const params = new URLSearchParams(req.query as Record<string, string>);
      return res.redirect(`${CLIENT_ROOT_URL}?${params.toString()}`);
    }
    const code = req.query.code as string;
    // eslint-disable-next-line camelcase
    const { access_token } = await getTokens(code);
    // Fetch the user's profile with the access token
    /* 
    {
      "id": "434744988281056",
      "first_name": "Marcus",
      "last_name": "Globant",
      "name_format": "{first} {last}",
      "short_name": "Marcus",
      "name": "Marcus Globant",
      "email": "globant.gamedev.temp@gmail.com",
      "picture": {
          "data": {
              "height": 50,
              "is_silhouette": false,
              "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=434744988281056&height=50&width=50&ext=1641730085&hash=AeSp3oGAXMrIR06cMkE",
              "width": 50
          }
      }
    }
  */
    const user = await getUser(access_token);
    const token = jwt.sign(user, JWT_SECRET as string);

    res.cookie(COOKIE_NAME as string, token, {
      maxAge: 900000,
      httpOnly: true,
      secure: NODE_ENV !== 'development',
    });

    return res.redirect(CLIENT_ROOT_URL as string);
  } catch (error) {
    return res.redirect(CLIENT_ROOT_URL as string);
  }
});

export default router;
