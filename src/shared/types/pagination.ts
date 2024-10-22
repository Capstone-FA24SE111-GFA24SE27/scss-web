export type PaginationContent<T> = {
  data: T[] & {
    createdAt: number
  },
  totalPages: number,
  totalElements: number,
}

export type PaginationFilter = {
  page: number
}