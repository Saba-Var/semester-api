import { createSemesterRequest, userInfoPrivateRequest } from 'requests'
import { NEW_SEMESTER_DATA_1, NEW_SEMESTER_DATA_2 } from './data'

describe('Semester Controller', () => {
  describe('Create new Semester - POST /api/semesters', () => {
    it('Should return 422 if invalid data provided', async () => {
      const { status, body } = await createSemesterRequest({
        startDate: 'date',
        name: '',
      })
      expect(status).toBe(422)
      expect(body.errors).toEqual({
        name: ['Semester name is required!'],
        startDate: ['Start date should be date!'],
      })
    })

    it('Should return 201 if the semester was created and user data updated successfully', async () => {
      const { status, body } = await createSemesterRequest(NEW_SEMESTER_DATA_1)
      expect(status).toBe(201)
      expect(body.message).toBe('Semester created successfully!')
      expect(body).toHaveProperty('_id')

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.semesters).toEqual([body._id])
      expect(userResponse.body.activeSemester).toBe(body._id)
    })

    it('Should return 409 if the semester with the given name already exists', async () => {
      const { status, body } = await createSemesterRequest(NEW_SEMESTER_DATA_1)

      expect(status).toBe(409)
      expect(body.message).toBe(
        `Semester with this name '${NEW_SEMESTER_DATA_1.name}' already exists!`
      )
    })

    it('Should return 409 when creating new semester while user already has got an active semester', async () => {
      const { status, body } = await createSemesterRequest(NEW_SEMESTER_DATA_2)

      expect(status).toBe(409)
      expect(body.message).toBe(
        'You already have an active semester! End it and create a new one.'
      )
    })
  })
})
