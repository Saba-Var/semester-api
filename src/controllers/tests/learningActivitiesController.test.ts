import type { ILearningActivityModel, LearningActivityPartial } from 'types'
import { LEARNING_ACTIVITY_REQUEST_DATA } from 'data'
import {
  updateLearningActivityRequest,
  getOneLearningActivityRequest,
  createLearningActivity,
  oneSemesterDataRequest,
  createSemesterRequest,
  testingAuthStore,
} from 'services'

describe('Learning Activities Controller', () => {
  let newLearningActivityId: null | string = null
  let semesterIdOfNewLearningActivity: null | string = null
  const updatedSubjectName = 'Biology'

  describe('Create a new learning activity POST - /api/learning-activities', () => {
    it('Should return 422 if data not provided', async () => {
      const { status } = await createLearningActivity({} as any)

      expect(status).toBe(422)
    })

    describe('Starting and ending time validation', () => {
      const startingTimeFormatValidationMessage =
        'Starting time should be in this format: HH:MM. Range - 09:00 to 23:00. Minutes should be either 00 or 30.'
      const endingTimeFormatValidationMessage =
        'Ending time should be in this format: HH:MM. Range - 09:30-23:30 .Minutes should be either 00 or 30.'
      const startingAndEndingTimeValidationMessage =
        'Starting time should be before ending time'

      it('Should return 422 if invalid weekday or activity type provided', async () => {
        const { status, body } = await createLearningActivity({
          weekday: 'invalid_weekday',
          activityType: 'invalid_activityType',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.weekday[0]).toBe(
          "'weekday' should be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday"
        )
        expect(body.errors.activityType[0]).toBe(
          "'activityType' should be one of the following: Lecture, Seminar, Laboratory, Project, Exam, Other"
        )
      })

      it('Should return 422 if starting and ending time have got invalid format', async () => {
        const { status, body } = await createLearningActivity({
          startingTime: '12.12',
          endingTime: '15,12',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingTimeFormatValidationMessage
        )
        expect(body.errors.endingTime[0]).toBe(
          endingTimeFormatValidationMessage
        )
      })

      it('Should return 422 if starting and ending time have got valid format but invalid minute values', async () => {
        const { status, body } = await createLearningActivity({
          startingTime: '12:12',
          endingTime: '15:12',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingTimeFormatValidationMessage
        )
        expect(body.errors.endingTime[0]).toBe(
          endingTimeFormatValidationMessage
        )
      })

      it('Should return 422 if starting time is less than 9 am', async () => {
        const { status, body } = await createLearningActivity({
          startingTime: '08:00',
          endingTime: '10:00',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingTimeFormatValidationMessage
        )
      })

      it('Should return 422 if starting time is greater than 23:30', async () => {
        const { status, body } = await createLearningActivity({
          startingTime: '24:00',
          endingTime: '23:30',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingTimeFormatValidationMessage
        )
      })

      it('Should return 422 if starting hour is 23 and minute is 30', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '23:30',
          endingTime: '23:30',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          'Starting time minutes should be 00 when hour is 23'
        )
      })

      it('Should return 422 if starting hour is greater than ending hour', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '12:00',
          endingTime: '11:00',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingAndEndingTimeValidationMessage
        )
      })

      it('Should return 422 if starting time is equal to ending time', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '12:00',
          endingTime: '12:00',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingAndEndingTimeValidationMessage
        )
      })

      it('Should return 422 if starting hour is equal to ending hour but starting minutes is greater than ending minutes', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '12:30',
          endingTime: '12:00',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingAndEndingTimeValidationMessage
        )
      })

      it('Should return 422 if ending time is greater than 23:30', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '12:30',
          endingTime: '24:00',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.endingTime[0]).toBe(
          'Ending time should be in this format: HH:MM. Range - 09:30-23:30 .Minutes should be either 00 or 30.'
        )
      })

      it('Should return 422 if ending time greater than starting hour', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '23:00',
          endingTime: '22:00',
        } as any)

        expect(status).toBe(422)
        expect(body.errors.endingTime[0]).toBe(
          'Ending time should be after starting time'
        )
      })
    })

    it('Should return 201 if learning activity created successfully', async () => {
      const semesterCreationResponse = await createSemesterRequest({
        startDate: '2022-09-01',
        name: 'Test semester',
      })
      expect(semesterCreationResponse.status).toBe(201)
      expect(semesterCreationResponse.body).toHaveProperty('_id')

      semesterIdOfNewLearningActivity = semesterCreationResponse.body._id

      const learningActivityCreationResponse = await createLearningActivity({
        ...LEARNING_ACTIVITY_REQUEST_DATA,
        semester: semesterIdOfNewLearningActivity as any,
      } as LearningActivityPartial)

      expect(learningActivityCreationResponse.status).toBe(201)
      newLearningActivityId = learningActivityCreationResponse.body._id

      const semesterDataResponse = await oneSemesterDataRequest(
        semesterIdOfNewLearningActivity as string
      )

      expect(semesterDataResponse.status).toBe(200)
      expect(semesterDataResponse.body).toHaveProperty('_id')

      const isLearningActivityInSemester =
        semesterDataResponse.body.learningActivities.some(
          (learningActivity: ILearningActivityModel & { _id: string }) =>
            learningActivity._id === newLearningActivityId
        )

      expect(isLearningActivityInSemester).toBe(true)

      const learningActivity =
        semesterDataResponse.body.learningActivities.find(
          (learningActivity: ILearningActivityModel & { _id: string }) =>
            learningActivity._id === newLearningActivityId
        )

      expect(learningActivity._id).toBe(newLearningActivityId)

      const learningActivityDataResponse = await getOneLearningActivityRequest(
        newLearningActivityId as string
      )

      expect(learningActivityDataResponse.status).toBe(200)
      expect(learningActivityDataResponse.body._id).toBe(newLearningActivityId)
      expect(learningActivityDataResponse.body.user).toBe(
        testingAuthStore.currentUserId
      )
      expect(learningActivityDataResponse.body.semester).toBe(
        semesterIdOfNewLearningActivity
      )
    })
  })

  describe('Update a learning activity PUT - /api/learning-activities/:id', () => {
    it('Should return 404 if learning activity not found', async () => {
      const { status } = await updateLearningActivityRequest(
        '609f1f0db1e9aa001f20a5d6',
        {
          ...LEARNING_ACTIVITY_REQUEST_DATA,
          semester: semesterIdOfNewLearningActivity as any,
        } as LearningActivityPartial
      )

      expect(status).toBe(404)
    })

    it('Should return 200 if learning activity updated successfully', async () => {
      expect(semesterIdOfNewLearningActivity).not.toBeNull()
      expect(newLearningActivityId).not.toBeNull()

      const { status } = await updateLearningActivityRequest(
        newLearningActivityId as string,
        {
          ...LEARNING_ACTIVITY_REQUEST_DATA,
          semester: semesterIdOfNewLearningActivity as any,
          subjectName: updatedSubjectName,
        } as LearningActivityPartial
      )

      expect(status).toBe(200)

      const learningActivityDataResponse = await getOneLearningActivityRequest(
        newLearningActivityId as string
      )

      expect(learningActivityDataResponse.status).toBe(200)
      expect(learningActivityDataResponse.body.subjectName).toBe(
        updatedSubjectName
      )
    })
  })

  describe('Get data of learning activity GET - /api/learning-activities/:id', () => {
    it('Should return 404 if learning activity not found', async () => {
      const { status } = await getOneLearningActivityRequest(
        '609f1f0db1e9aa001f20a5d6'
      )

      expect(status).toBe(404)
    })

    it('Should return 200 if learning activity data returned successfully', async () => {
      expect(newLearningActivityId).not.toBeNull()

      const { status, body } = await getOneLearningActivityRequest(
        newLearningActivityId as string
      )

      expect(status).toBe(200)
      expect(body).toEqual({
        ...LEARNING_ACTIVITY_REQUEST_DATA,
        subjectName: updatedSubjectName,
        _id: newLearningActivityId,
        semester: semesterIdOfNewLearningActivity,
        user: testingAuthStore.currentUserId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })
  })
})
