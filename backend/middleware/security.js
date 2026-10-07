import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

const getAllowedOrigins = () => {
  const configured = process.env.CLIENT_URLS || process.env.CLIENT_URL;
  const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  return (configured ? configured.split(',') : defaults)
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const applySecurity = (app) => {
  app.use(helmet({
    crossOriginResourcePolicy: false, // For image loading
  }));

  const allowedOrigins = getAllowedOrigins();

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  app.use(cookieParser(process.env.COOKIE_SECRET));
  
  app.use((req, res, next) => {
    // Express 5 exposes req.query as a getter; the package middleware assigns to it.
    // Sanitize the parsed objects in place to keep operator injection protection.
    for (const value of [req.body, req.params, req.query]) {
      if (value && typeof value === 'object') mongoSanitize.sanitize(value);
    }
    next();
  });
};

export default applySecurity;
