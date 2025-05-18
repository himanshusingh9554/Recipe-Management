import dotenv from 'dotenv';


export const config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'recipe_platform_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    
  },
  
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};