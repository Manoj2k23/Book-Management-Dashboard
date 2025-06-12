"use client"

import { useState, useEffect } from "react"
import { BookTable } from "../components/books/BookTable"
import { BookForm } from "../components/books/BookForm"
import { SearchAndFilters } from "../components/books/SearchAndFilters"
import { Pagination } from "../components/ui/Pagination"
import { Modal } from "../components/ui/Modal"
import { StatsCards } from "../components/dashboard/StatsCards"
import { useBooks, useForceRefresh } from "../hooks/useBooks"
import { useAppSelector, useAppDispatch } from "../lib/hooks"
import { setCurrentPage, setSearchTerm, setGenreFilter, setStatusFilter } from "../lib/store/booksSlice"


export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { currentPage, searchTerm, genreFilter, statusFilter } = useAppSelector((state) => state.books)
  const forceRefresh = useForceRefresh()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  const { books, allBooks, isLoading, error, totalPages } = useBooks({
    page: currentPage,
    search: searchTerm,
    genre: genreFilter,
    status: statusFilter,
  })

   
  const handleAddBook = () => {
    setEditingBook(null)
    setIsModalOpen(true)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBook(null)
  }

  const handlePageChange = (page) => {
    console.log("Changing page to:", page)
    dispatch(setCurrentPage(page))
  }

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term))
    dispatch(setCurrentPage(1)) 
  }

  const handleGenreFilter = (genre) => {
    dispatch(setGenreFilter(genre))
    dispatch(setCurrentPage(1))  
  }

  const handleStatusFilter = (status) => {
    dispatch(setStatusFilter(status))
    dispatch(setCurrentPage(1)) 
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error loading books: {error}</div>
        <button onClick={forceRefresh} className="btn-primary">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Books Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your book collection</p>
        </div>
        <div className="flex gap-3">
          <button onClick={forceRefresh} className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          <button onClick={handleAddBook} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Book
          </button>
        </div>
      </div>

      {/*  Cards */}
      <StatsCards books={allBooks} isLoading={isLoading} />

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        genreFilter={genreFilter}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onGenreFilter={handleGenreFilter}
        onStatusFilter={handleStatusFilter}
      />

     
      {/* Books Table */}
      <BookTable books={books} isLoading={isLoading} onEdit={handleEditBook} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBook ? "Edit Book" : "Add Book"}>
        <BookForm book={editingBook} onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}
