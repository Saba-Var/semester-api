export const generateRedirectUri = (language: 'en' | 'ka', path: string) => {
  const redirectUri = `${process.env.FRONTEND_URI!}${
    language === 'en' ? '/en' : ''
  }/${path}`

  return redirectUri
}
