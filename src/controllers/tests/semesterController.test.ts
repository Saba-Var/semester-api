import { NEW_SEMESTER_DATA_1, NEW_SEMESTER_DATA_2 } from './data'
import { testingAuthStore } from 'store'
import {
  allSemestersDataRequest,
  userInfoPrivateRequest,
  oneSemesterDataRequest,
  createSemesterRequest,
  deleteSemesterRequest,
} from 'requests'

describe('Semester Controller', () => {
  let newSemesterId: string

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
      newSemesterId = body._id
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

  describe('Get all semesters list - GET /api/semesters', () => {
    it('Should return 200 if semesters list of the user was fetched successfully', async () => {
      const { status, body } = await allSemestersDataRequest()
      expect(status).toBe(200)
      expect(body).toHaveLength(1)
      expect(body[0]).toEqual({
        ...NEW_SEMESTER_DATA_1,
        _id: newSemesterId,
        user: testingAuthStore.currentUserId,
        endDate: null,
        isCurrentSemester: true,
        learningActivities: [],
        startDate: expect.any(String),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      })
    })
  })

  describe('Get one semester data by id', () => {
    it('Should return 422 if the provided semester id is invalid', async () => {
      const { status, body } = await oneSemesterDataRequest('invalidId')
      expect(status).toBe(422)
      expect(body.errors.id).toEqual([
        'Invalid id param. Provide a valid mongoDB id.',
      ])
    })

    it("Should return 404 if the semester with the given id doesn't exist", async () => {
      const { status, body } = await oneSemesterDataRequest(
        '5f8e9d8b4b2a3c1f4c7a5a1c'
      )
      expect(status).toBe(404)
      expect(body.message).toBe('Semester not found!')
    })

    it('Should return 200 if the semester data was fetched successfully', async () => {
      const { status, body } = await oneSemesterDataRequest(newSemesterId)
      expect(status).toBe(200)
      expect(body).toEqual({
        ...NEW_SEMESTER_DATA_1,
        _id: newSemesterId,
        user: testingAuthStore.currentUserId,
        endDate: null,
        isCurrentSemester: true,
        learningActivities: [],
        startDate: expect.any(String),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      })
    })
  })

  describe('Delete semester', () => {
    it('Should return 404 if semester with the given id not found', async () => {
      const { status, body } = await deleteSemesterRequest(
        '5f8e9d8b4b2a3c1f4c7a5a1c'
      )
      expect(status).toBe(404)
      expect(body.message).toBe('Semester not found!')
    })

    it("Should return 200 if the semester was deleted successfully and user's data updated", async () => {
      const { status, body } = await deleteSemesterRequest(newSemesterId)
      expect(status).toBe(200)
      expect(body.message).toBe('Semester deleted successfully!')
      expect(body).toHaveProperty('_id')

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.semesters).not.toContain(newSemesterId)
      expect(userResponse.body.activeSemester).toBeNull()
    })
  })
})
