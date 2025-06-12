"use client"

import { useState } from "react"
import { BookTableSkeleton } from "./BookTableSkeleton"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { useBookMutations,useForceRefresh } from "../../hooks/useBooks"
import { showToast } from "../../components/ui/toast"

export function BookTable({ books, isLoading, onEdit }) {
  

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    book: null,
  })

  const { deleteBook } = useBookMutations()
  const forceRefresh = useForceRefresh()

  const handleDeleteClick = (book) => {
    console.log("Delete button clicked for book:", book)
    setDeleteConfirm({ isOpen: true, book })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.book?._id) {
      console.error("No book ID found for deletion")
      return
    }

    try {
      console.log("Confirming delete for book:", deleteConfirm.book._id)
      const result = await deleteBook(deleteConfirm.book._id)

      if (result.success) {
        showToast("Book deleted successfully", "success")
        // Force refresh to ensure UI is updated
        setTimeout(() => {
          forceRefresh()
        }, 100)
      } else {
        showToast(`Failed to delete book: ${result.error}`, "error")
      }
    } catch (error) {
      console.error("Delete error:", error)
      showToast("Failed to delete book", "error")
    } finally {
      setDeleteConfirm({ isOpen: false, book: null })
    }
  }

  const handleEditClick = (book) => {
    console.log("Edit button clicked for book:", book)
    onEdit(book)
  }

  if (isLoading) {
    return <BookTableSkeleton />
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-gray-500 text-lg mb-2">No books found on this page</div>
        <p className="text-sm text-gray-400">Try going back to page 1 or adjusting your search filters</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.genre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.publishedYear}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                        book.status === "Available" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded transition-colors hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(book)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteConfirm.book?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, book: null })}
      />
    </>
  )
}
