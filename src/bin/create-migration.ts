#!/usr/bin/env node

import { coloredLogger } from '../utils/coloredLogger'
import fs from 'fs/promises'
import path from 'path'

const getFormattedDate = () => {
  const currentDate = new Date()
  return currentDate.toISOString().slice(0, 10).replace(/-/g, '')
}

const exitWithError = () => {
  coloredLogger(
    'command usage - npm run create-migration <migration_name>',
    'error'
  )
  process.exit(1)
}

const args = process.argv.slice(2)

if (args.length !== 1) {
  exitWithError()
}

const migrationName = args[0]
const migrationsFolder = path.join('src', 'database', 'migrations')

if (!migrationName) {
  exitWithError()
}

const migrationContent = `// migration logic for "${migrationName}" here\n`

const migrationFileName = `${getFormattedDate()}_${migrationName}.ts`
const migrationFilePath = `${migrationsFolder}/${migrationFileName}`

;(async () => {
  try {
    if (!(await fs.access(migrationsFolder).catch(() => false))) {
      await fs.mkdir(migrationsFolder, { recursive: true })
    }

    const fileExists = await fs
      .access(migrationFilePath)
      .then(() => true)
      .catch(() => false)

    if (fileExists) {
      coloredLogger(
        `Migration file "${migrationFileName}" already exists.`,
        'error'
      )
    } else {
      await fs.writeFile(migrationFilePath, migrationContent)

      coloredLogger(
        `Migration file "${migrationFileName}" created in "${migrationsFolder}"`,
        'success'
      )
    }
  } catch (error: any) {
    coloredLogger(error.message, 'error')
    process.exit(1)
  }
})()
