const API_BASE_URL = "https://crudcrud.com/api/b38b10e5e13249f0a363692cfa235266"


export const booksApi = {
  getAll: async () => {
    try {
      console.log("API: Fetching all books...")
      const response = await fetch(`${API_BASE_URL}/books`, {
        cache: "no-store", 
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API: Fetched books:", data.length, "books")
      return data
    } catch (error) {
      console.error("API Error - getAll:", error)
      throw error
    }
  },

  create: async (book) => {
    try {
      console.log("API: Creating book:", book)
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      })

      if (!response.ok) {
        throw new Error(`Failed to create book: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API: Created book:", data)
      return data
    } catch (error) {
      console.error("API Error - create:", error)
      throw error
    }
  },

  update: async (id, book) => {
    try {
      console.log("API: Updating book:", id, book)
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      })

      console.log("API: Update response status:", response.status)

      if (!response.ok) {
        throw new Error(`Failed to update book: ${response.status} ${response.statusText}`)
      }

       let data
      try {
        const text = await response.text()
        data = text ? JSON.parse(text) : { _id: id, ...book }
      } catch (parseError) {
        data = { _id: id, ...book }
      }

      console.log("API: Updated book:", data)
      return data
    } catch (error) {
      console.error("API Error - update:", error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      console.log("API: Deleting book:", id)
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`)
      }

      console.log("API: Deleted book:", id)
      return true
    } catch (error) {
      console.error("API Error - delete:", error)
      throw error
    }
  },
}
