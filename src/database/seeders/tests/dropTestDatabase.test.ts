import { dropTestDatabase } from 'database'

describe('drop the test database', () => {
  it('Should return true if database dropped successfully', async () => {
    const isDropped = await dropTestDatabase()

    expect(isDropped).toBe(true)
  })
})
