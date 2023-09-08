export const TEST_USER_CREDENTIALS = {
  email: process.env.TESTING_USER_EMAIL,
  password: process.env.TESTING_USER_PASSWORD,
  confirmPassword: process.env.TESTING_USER_PASSWORD,
  username: process.env.TESTING_USER_USERNAME,
} as const
