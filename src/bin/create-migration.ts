#!/usr/bin/env node

import path from 'path'
import fs from 'fs'

const getFormattedDate = () => {
  const currentDate = new Date()
  return currentDate.toISOString().slice(0, 10).replace(/-/g, '')
}

const exitWithError = () => {
  console.error('Usage: npm run create-migration <migration_name>')
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

const migrationContent = `// migration logic for "${migrationName}" here
`

const migrationFileName = `${getFormattedDate()}_${migrationName}.ts`
const migrationFilePath = `${migrationsFolder}/${migrationFileName}`

if (!fs.existsSync(migrationsFolder)) {
  fs.mkdirSync(migrationsFolder, { recursive: true })
}

fs.writeFileSync(migrationFilePath, migrationContent)

console.log(
  `Migration file "${migrationFileName}" created in "${migrationsFolder}"`
)
