import { universities } from 'data'
import { University } from 'models'
import { coloredLogger } from 'bin'

export const universitiesSeeder = async () => {
  try {
    await Promise.all(
      universities.map(async (university) => {
        await University.create(university)
      })
    )

    coloredLogger('Universities seeded successfully!', 'success')
  } catch (error: any) {
    coloredLogger(`Universities seeder - ${error.message}`, 'error')
  }
}
