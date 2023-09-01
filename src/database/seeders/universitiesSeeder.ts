import { universities } from 'data'
import { University } from 'models'
import { logger } from 'bin'

export const universitiesSeeder = async () => {
  try {
    await Promise.all(
      universities.map(async (university) => {
        await University.create(university)
      })
    )

    logger('Universities seeded successfully!', 'success')
  } catch (error: any) {
    logger(`Universities seeder - ${error.message}`, 'error')
  }
}
