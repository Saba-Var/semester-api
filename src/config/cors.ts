import cors from 'cors'

const configuredCors = cors({
  origin: process.env.FRONTEND_URI!,
  credentials: true,
})

export default configuredCors
