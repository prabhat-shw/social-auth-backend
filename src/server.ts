import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
import PassportAuthRoute from './passport';
import AuthRoute from './raw-integration';

const { PORT, AUTH_VIA_PASSPORT } = process.env;
const app = express();

// app.use(
//   cors({
//     // Sets Access-Control-Allow-Origin to the UI URI
//     origin: CLIENT_ROOT_URL,
//     // Sets Access-Control-Allow-Credentials to true
//     credentials: true,
//   })
// );

// app.use(cookieParser());
app.use('/api/auth', AUTH_VIA_PASSPORT === 'true' ? PassportAuthRoute : AuthRoute);

function main() {
  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}

main();
