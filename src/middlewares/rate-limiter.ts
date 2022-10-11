import rateLimit from 'express-rate-limit'

const rateLimiter = rateLimit({
  windowMs: 5 * 6000,
  max: 15,
  message: {
    message:
      'Too many requests detected from your IP address. Try again after 5 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export default rateLimiter
