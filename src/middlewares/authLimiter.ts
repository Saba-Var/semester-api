import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 10 * 6000,
  max: 20,
  message: {
    message:
      'Too many requests detected from your IP address. Try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
