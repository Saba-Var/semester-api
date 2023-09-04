import { validateMongoDbId } from 'utils'
import { param } from 'express-validator'

export const idParamSchema = [param('id').custom(validateMongoDbId)]

export default idParamSchema
