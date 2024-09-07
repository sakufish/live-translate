import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  googleApiKey: process.env.GOOGLE_API_KEY, 
};
