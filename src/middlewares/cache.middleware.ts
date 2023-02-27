// Middleware to cache GET requests for 5 minutes (client-side cache)
import { NextFunction, Request, Response } from 'express';

const setCache = (req: Request, res: Response, next: NextFunction) => {
  // Keep cache for 5 minutes (in seconds)
  const period = 60 * 5;

  // Only cache for GET requests
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, max-age=${period}`);
  } else {
    // For other requess set strict no cache parameter
    res.set('Cache-Control', 'no-store');
  }

  // To pass the request
  next();
};

export default setCache;
