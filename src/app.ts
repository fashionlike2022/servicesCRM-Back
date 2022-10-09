import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
let passport = require('passport'); // import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import { ApiError, errorConverter, errorHandler } from './utils/errors';
import routes from './routes/v1';
import jwtStrategy from './modules/auth/jwtStrategy.passport';
import { authLimiter } from './utils';

const app: Express = express();

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// jwt authentication
// app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
