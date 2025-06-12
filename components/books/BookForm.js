"use client"
import { useForm } from "react-hook-form"
import { useBookMutations,useForceRefresh } from "../../hooks/useBooks"
import { showToast } from "../../components/ui/toast"

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
]

export function BookForm({ book, onClose }) {
  const { createBook, updateBook } = useBookMutations()
  const forceRefresh = useForceRefresh()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          genre: book.genre,
          publishedYear: book.publishedYear,
          status: book.status,
          description: book.description || "",
        }
      : {
          title: "",
          author: "",
          genre: "",
          publishedYear: new Date().getFullYear(),
          status: "Available",
          description: "",
        },
  })

  const onSubmit = async (data) => {
    console.log("Form submission started:", data)

    try {
      let result

      if (book?._id) {
        console.log("Updating existing book:", book._id)
        result = await updateBook(book._id, data)

        if (result.success) {
          showToast("Book updated successfully", "success")
           setTimeout(() => {
            forceRefresh()
          }, 100)
          onClose()
        } else {
          showToast(`Failed to update book: ${result.error}`, "error")
        }
      } else {
        console.log("Creating new book")
        result = await createBook(data)

        if (result.success) {
          showToast("Book created successfully", "success")
          reset()
           setTimeout(() => {
            forceRefresh()
          }, 100)
          onClose()
        } else {
          showToast(`Failed to create book: ${result.error}`, "error")
        }
      }
    } catch (error) {
      console.error("Form submission unexpected error:", error)
      showToast(`Unexpected error: ${error.message}`, "error")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            className="input-field"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            id="author"
            type="text"
            className="input-field"
            {...register("author", { required: "Author is required" })}
          />
          {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Genre *
          </label>
          <select id="genre" className="select-field" {...register("genre", { required: "Genre is required" })}>
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>}
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
            Published Year *
          </label>
          <input
            id="publishedYear"
            type="number"
            min="1000"
            max={new Date().getFullYear()}
            className="input-field"
            {...register("publishedYear", {
              required: "Published year is required",
              min: { value: 1000, message: "Year must be at least 1000" },
              max: { value: new Date().getFullYear(), message: "Year cannot be in the future" },
              valueAsNumber: true,
            })}
          />
          {errors.publishedYear && <p className="mt-1 text-sm text-red-600">{errors.publishedYear.message}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select id="status" className="select-field" {...register("status", { required: "Status is required" })}>
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
        </div>

       
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {book ? "Updating..." : "Creating..."}
              </span>
            ) : book ? (
              "Update Book"
            ) : (
              "Add Book"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
