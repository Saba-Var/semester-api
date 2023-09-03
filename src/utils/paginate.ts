export const paginate = async (
  model: any,
  queryParams?: {
    limit?: number
    page?: number
  }
) => {
  const limit = queryParams?.limit || 10
  const page = queryParams?.page || 1

  const skip = (page - 1) * limit

  const totalItems = await model.countDocuments()
  const totalPages = Math.ceil(totalItems / limit)

  const data = await model.find().skip(skip).limit(limit)

  return { data, paginationInfo: { page, limit, totalItems, totalPages } }
}
