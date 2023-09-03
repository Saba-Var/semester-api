import { PaginateParams } from './types'

export const paginate = async ({ query, model }: PaginateParams) => {
  const limit = query?.limit || 10
  const page = query?.page || 1

  const skip = (page - 1) * limit

  const totalItems = await model.countDocuments()
  const totalPages = Math.ceil(totalItems / limit)

  const data = await model.find().skip(skip).limit(limit)

  const lastPage = totalPages > 0 ? totalPages : 1

  return {
    paginationInfo: { page, limit, totalItems, lastPage },
    data,
  }
}
