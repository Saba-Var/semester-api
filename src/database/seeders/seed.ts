import { universitiesSeeder } from './universitiesSeeder'
import { connectToMongo } from 'config'

const seed = async () => {
  await connectToMongo()

  await universitiesSeeder()

  process.exit(1)
}

seed()
