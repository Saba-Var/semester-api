export const coloredLogger = (message: string, type: 'success' | 'error') => {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    resetColor: '\x1b[0m',
  }

  console.log(
    `${colors[type]}${
      type === 'success' ? '✅ Success' : '❌ Error'
    }: ${message}${colors.resetColor}`
  )
}
