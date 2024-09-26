export type PaginationContent<T> = {
  data: T[],
  totalPages: number,
  totalElements: number,
}

export type PaginationFilter = {
  page: number
}