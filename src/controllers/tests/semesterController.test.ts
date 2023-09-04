import { FALL_SEMESTER, SPRING_SEMESTER } from 'data'
import { testingAuthStore } from 'store'
import {
  allSemestersDataRequest,
  userInfoPrivateRequest,
  oneSemesterDataRequest,
  createSemesterRequest,
  deleteSemesterRequest,
  updateSemesterRequest,
  endSemesterRequest,
} from 'requests'

describe('Semester Controller', () => {
  let firstSemesterId: string
  let secondSemesterId: string

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
      const { status, body } = await createSemesterRequest(FALL_SEMESTER)
      expect(status).toBe(201)
      expect(body.message).toBe('Semester created successfully!')
      expect(body).toHaveProperty('_id')

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.semesters).toEqual([body._id])
      expect(userResponse.body.activeSemester).toBe(body._id)
      firstSemesterId = body._id
    })

    it('Should return 409 if the semester with the given name already exists', async () => {
      const { status, body } = await createSemesterRequest(FALL_SEMESTER)
      expect(status).toBe(409)
      expect(body.message).toBe(
        `Semester with this name '${FALL_SEMESTER.name}' already exists!`
      )
    })

    it('Should return 409 when creating new semester while user already has got an active semester', async () => {
      const { status, body } = await createSemesterRequest(SPRING_SEMESTER)
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
        ...FALL_SEMESTER,
        _id: firstSemesterId,
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

  describe('Get one semester data by id - GET /api/semesters/:id', () => {
    it('Should return 422 if the provided semester id is invalid', async () => {
      const { status, body } = await oneSemesterDataRequest('invalidId')
      expect(status).toBe(422)
      expect(body.errors.id).toEqual(['Invalid mongoDB id!'])
    })

    it("Should return 404 if the semester with the given id doesn't exist", async () => {
      const { status, body } = await oneSemesterDataRequest(
        '5f8e9d8b4b2a3c1f4c7a5a1c'
      )
      expect(status).toBe(404)
      expect(body.message).toBe('Semester not found!')
    })

    it('Should return 200 if the semester data was fetched successfully', async () => {
      const { status, body } = await oneSemesterDataRequest(firstSemesterId)
      expect(status).toBe(200)
      expect(body).toEqual({
        ...FALL_SEMESTER,
        _id: firstSemesterId,
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

  describe('End semester - PUT /api/semesters/:id', () => {
    it('Should return 422 if the provided semester id is invalid', async () => {
      const { status, body } = await oneSemesterDataRequest('invalidId')
      expect(status).toBe(422)
      expect(body.errors.id).toEqual(['Invalid mongoDB id!'])
    })

    it("Should return 404 if the semester with the given id doesn't exist", async () => {
      const { status, body } = await oneSemesterDataRequest(
        '5f8e9d8b4b2a3c1f4c7a5a1c'
      )
      expect(status).toBe(404)
      expect(body.message).toBe('Semester not found!')
    })

    it("Should return 422 if end date is less than semester's start date. User data should not be modified.", async () => {
      const { status, body } = await endSemesterRequest(firstSemesterId, {
        endDate: '2000-10-10',
      })
      expect(status).toBe(422)
      expect(body.errors.endDate).toEqual([
        'End date cannot be before start date!',
      ])

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.activeSemester).toBe(firstSemesterId)
    })

    it('Should return 200 if the semester was ended successfully and user data updated', async () => {
      const { status, body } = await endSemesterRequest(firstSemesterId, {
        endDate: '2024-10-10',
      })
      expect(status).toBe(200)
      expect(body).toHaveProperty('_id')

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.activeSemester).toBe(null)
    })

    it('Should return 409 if the semester is already ended', async () => {
      const { status, body } = await endSemesterRequest(firstSemesterId, {
        endDate: '2024-10-10',
      })
      expect(status).toBe(409)
      expect(body.message).toBe('Semester already ended!')
    })
  })

  describe('Delete semester - DELETE /api/semesters/:id', () => {
    it('Should return 404 if semester with the given id not found', async () => {
      const { status, body } = await deleteSemesterRequest(
        '5f8e9d8b4b2a3c1f4c7a5a1c'
      )
      expect(status).toBe(404)
      expect(body.message).toBe('Semester not found!')
    })

    it("Should return 200 if the semester was deleted successfully and user's data updated", async () => {
      const { status, body } = await deleteSemesterRequest(firstSemesterId)
      expect(status).toBe(200)
      expect(body.message).toBe('Semester deleted successfully!')
      expect(body).toHaveProperty('_id')

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.semesters).not.toContain(firstSemesterId)
      expect(userResponse.body.activeSemester).toBeNull()
    })
  })

  describe('Update semester - PUT /api/semesters/:id', () => {
    it('Should return 422 if the provided id and data is invalid', async () => {
      const { status, body } = await updateSemesterRequest('invalidId', {
        name: '',
        startDate: '',
      })
      expect(status).toBe(422)
      expect(body.errors).toHaveProperty('id')
      expect(body.errors).toHaveProperty('name')
      expect(body.errors).toHaveProperty('startDate')
    })

    it("Should return 404 if the semester with the given id doesn't exist", async () => {
      const { status, body } = await updateSemesterRequest(
        '5f8e9d8b4b2a3c1f4c7a5a1c',
        FALL_SEMESTER
      )
      expect(status).toBe(404)
      expect(body.message).toBe('Semester not found!')
    })

    it('Should return 422 if semester with the given name already exists.', async () => {
      const firstSemesterCreationResponse = await createSemesterRequest(
        FALL_SEMESTER
      )
      firstSemesterId = firstSemesterCreationResponse.body._id
      expect(firstSemesterId).toBeDefined()

      const endSemesterResponse = await endSemesterRequest(firstSemesterId, {
        endDate: '2024-10-10',
      })
      expect(endSemesterResponse.status).toBe(200)

      const secondSemesterCreationResponse = await createSemesterRequest(
        SPRING_SEMESTER
      )
      secondSemesterId = secondSemesterCreationResponse.body._id
      expect(secondSemesterId).toBeDefined()

      const { body, status } = await updateSemesterRequest(
        secondSemesterId,
        FALL_SEMESTER
      )

      expect(status).toBe(422)
      expect(body.errors.name).toEqual([
        `Semester with this name '${FALL_SEMESTER.name}' already exists!`,
      ])
    })

    it('Should return 409 if semester is already ended', async () => {
      const { status, body } = await updateSemesterRequest(
        firstSemesterId,
        FALL_SEMESTER
      )
      expect(status).toBe(409)
      expect(body.message).toBe(
        "Semester is already ended. You can't edit semester!"
      )
    })

    it('Should return 200 if semester updated successfully', async () => {
      const newData = {
        name: 'New name',
        startDate: '2022-12-12',
      }
      const { status } = await updateSemesterRequest(secondSemesterId, newData)
      expect(status).toBe(200)

      const { body } = await oneSemesterDataRequest(secondSemesterId)
      expect(body.name).toBe(newData.name)
      expect(body.startDate).toBe(new Date(newData.startDate).toISOString())
    })

    it('Semesters list should be empty after deleting the both semesters. Also, user should not have any active semester.', async () => {
      await deleteSemesterRequest(firstSemesterId)
      await deleteSemesterRequest(secondSemesterId)

      const semestersResponse = await allSemestersDataRequest()
      expect(semestersResponse.body).toEqual([])

      const userResponse = await userInfoPrivateRequest()
      expect(userResponse.body.semesters).toEqual([])
      expect(userResponse.body.activeSemester).toBeNull()
    })
  })
})
