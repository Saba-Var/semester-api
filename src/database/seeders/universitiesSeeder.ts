import { coloredLogger } from '../../utils/coloredLogger'
import { universities } from 'data'
import { University } from 'models'

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
