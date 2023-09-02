import { universitiesSeeder } from './universitiesSeeder'
import { connectToMongo } from 'config'

const seed = async () => {
  const db = await connectToMongo()

  await universitiesSeeder()

  await db.connection.close()
  process.exit(1)
}

seed()
