import type { ValidationChain } from 'express-validator'
import { body } from 'express-validator'
import type { Request } from 'express'
import type { UserImage } from 'types'

const isImageFieldExists: any = (
  _value: { image?: UserImage },
  { req }: { req: Request }
) => !!req.body?.image && !!Object.keys(req.body?.image).length

export const userImageSchema: ValidationChain[] = [
  body('image')
    .optional()
    .custom((value) => {
      if (value === undefined || Object.keys(value).length === 0) {
        return true
      }
      return true
    }),

  body('image.url')
    .if(isImageFieldExists)
    .notEmpty()
    .withMessage('image_is_required')
    .bail()
    .isURL({ protocols: ['https'], require_protocol: true })
    .withMessage('enter_valid_url')
    .bail()
    .custom((value) => value.startsWith(process.env.DICEBEAR_API_URI))
    .withMessage('enter_dicebear_avatar_url'),

  body('image.collectionName')
    .if(isImageFieldExists)
    .notEmpty()
    .withMessage('collection_name_is_required'),

  body('image.type')
    .if(isImageFieldExists)
    .notEmpty()
    .withMessage('image_type_is_required')
    .bail()
    .isIn(['dicebear', 'upload'])
    .withMessage('user_image_type_warning'),
]
