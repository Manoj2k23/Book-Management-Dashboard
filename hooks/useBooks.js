import useSWR, { mutate as globalMutate } from "swr"
import { booksApi } from "../lib/api"
 

const BOOKS_PER_PAGE = 10
const CACHE_KEY = "books"

 const fetcher = async (...args) => {
   return await booksApi.getAll(...args)
}

export function useBooks(filters) {
  const {
    data: allBooks,
    error,
    mutate,
  } = useSWR(CACHE_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 60000,  
  })

  const filteredBooks =
    allBooks?.filter((book) => {
      const matchesSearch =
        !filters.search ||
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase())

      const matchesGenre = !filters.genre || book.genre === filters.genre
      const matchesStatus = !filters.status || book.status === filters.status

      return matchesSearch && matchesGenre && matchesStatus
    }) || []

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)
  const startIndex = (filters.page - 1) * BOOKS_PER_PAGE
  const books = filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE)

  return {
    books,
    allBooks,
    isLoading: !allBooks && !error,
    error: error?.message,
    totalPages,
    mutate,
  }
}

export function useBookMutations() {
  const createBook = async (book) => {
    try {
      console.log("Creating book:", book)
      const newBook = await booksApi.create(book)
      console.log("Book created successfully:", newBook)

       await globalMutate(CACHE_KEY, async (currentBooks) => {
        return currentBooks ? [...currentBooks, newBook] : [newBook]
      })

      return { success: true }
    } catch (error) {
      console.error("Create book error:", error)
      return { success: false, error: error.message }
    }
  }

  const updateBook = async (id, bookData) => {
    try {
      console.log("Updating book:", id, bookData)
      await booksApi.update(id, bookData)
      console.log("Book updated successfully")

       await globalMutate(CACHE_KEY, async (currentBooks) => {
        return currentBooks?.map((book) => (book._id === id ? { ...book, ...bookData } : book)) || []
      })

      return { success: true }
    } catch (error) {
      console.error("Update book error:", error)
      return { success: false, error: error.message }
    }
  }

  const deleteBook = async (id) => {
    try {
      console.log("Deleting book:", id)
      await booksApi.delete(id)
      console.log("Book deleted successfully")

       await globalMutate(CACHE_KEY, async (currentBooks) => {
        return currentBooks?.filter((book) => book._id !== id) || []
      })

      return { success: true }
    } catch (error) {
      console.error("Delete book error:", error)
      return { success: false, error: error.message }
    }
  }

  return { createBook, updateBook, deleteBook }
}

 export function useForceRefresh() {
  return () => {
    console.log("Force refreshing book data...")
    globalMutate(CACHE_KEY)
  }
}
