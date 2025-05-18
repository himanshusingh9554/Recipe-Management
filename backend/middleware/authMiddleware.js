
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import db from '../models/index.js';  
const { User } = db;

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) 
      return res.status(401).json({ message: 'Access token missing' });
    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
      if (err) 
        return res.status(403).json({ message: 'Invalid or expired token' });
      const user = await User.findByPk(decoded.id);
      if (!user) 
        return res.status(401).json({ message: 'User no longer exists' });

      if (user.isBanned) {
        return res.status(403).json({ message: 'Your account has been banned' });
      }
      req.user = {
        id:       user.id,
        email:    user.email,
        isAdmin:  user.isAdmin,
      };

      next();
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
