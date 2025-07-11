import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        message: 'Access denied. No token provided or invalid token format.' 
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ 
        message: 'Invalid token.' 
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during authentication.' 
    });
    return;
  }
};

export { JWT_SECRET };
export type { AuthRequest };
