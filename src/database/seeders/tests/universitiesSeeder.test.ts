import { universitiesSeeder } from '../universitiesSeeder'

describe('Seed database with universities', () => {
  it('Should log success message if the universities seeded successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await universitiesSeeder()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/✅ Success: Universities seeded successfully/)
    )
    consoleSpy.mockRestore()
  })
})
