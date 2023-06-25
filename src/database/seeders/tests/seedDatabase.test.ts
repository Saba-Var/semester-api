import { seedTestDatabase } from 'database'

describe('Seed the test database', () => {
  it('Should return true if database seeded successfully', async () => {
    const isSeeded = await seedTestDatabase()

    expect(isSeeded).toBe(true)
  })
})
