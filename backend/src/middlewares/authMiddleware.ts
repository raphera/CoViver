import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

const secretKey = process.env.SECRET_KEY;

export const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  if (!secretKey) {
    throw new Error('Secret key is empty');
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid authentication token' });
    }

    req.user = user;

    next();
  });
};