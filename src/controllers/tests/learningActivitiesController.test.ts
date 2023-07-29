import { createLearningActivity } from 'requests'

describe('Learning Activities Controller', () => {
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
          endingTime: '23:30', // placeholder value
        } as any)

        expect(status).toBe(422)
        expect(body.errors.startingTime[0]).toBe(
          startingTimeFormatValidationMessage
        )
      })

      it('Should return 422 if starting hour is 23 and minute is 30', async () => {
        const { body, status } = await createLearningActivity({
          startingTime: '23:30',
          endingTime: '23:30', // placeholder value
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
          startingTime: '12:30', // placeholder value
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
  })
})
