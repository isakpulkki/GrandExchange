const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limiter };
