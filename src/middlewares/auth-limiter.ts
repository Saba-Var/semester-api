import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 10 * 6000,
  max: 10,
  message: {
    message:
      'Too many requests detected from your IP address. Try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export default authLimiter
