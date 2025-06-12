export interface Book {
  _id?: string
  title: string
  author: string
  genre: string
  publishedYear: number
  status: "Available" | "Issued"
  description?: string
}

export interface BookFilters {
  page: number
  search: string
  genre: string
  status: string
}
