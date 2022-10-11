import rateLimit from 'express-rate-limit'

const rateLimiter = rateLimit({
  windowMs: 10 * 6000,
  max: 10,
  message: {
    message:
      'Too many requests detected from your IP address. Try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export default rateLimiter
