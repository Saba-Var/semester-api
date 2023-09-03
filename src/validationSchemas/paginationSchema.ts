import { limitQueryParam, pageQuerySchema } from './common'

export const paginationSchema = [limitQueryParam, pageQuerySchema]
