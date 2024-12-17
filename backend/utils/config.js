require('dotenv').config();

const SECRET = process.env.SECRET;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const USERNAME_LIMITS = {
  MIN_LENGTH: 3, 
  MAX_LENGTH: 20, 
};

const PASSWORD_LIMITS = {
  MIN_LENGTH: 8,  
  MAX_LENGTH: 64, 
};

const LISTING_LIMITS = {
  TITLE_MAX_LENGTH: 80, 
  DESCRIPTION_MAX_LENGTH: 500, 
  PRICE_MAX_LENGTH: 10,  
};

module.exports = {
  SECRET,
  MONGODB_URI,
  USERNAME_LIMITS,
  PASSWORD_LIMITS,
  LISTING_LIMITS,
};