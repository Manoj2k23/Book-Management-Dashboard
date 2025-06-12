"use client"

import { useState, useEffect,useCallback } from "react"


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

export function SearchAndFilters({ searchTerm, genreFilter, statusFilter, onSearch, onGenreFilter, onStatusFilter }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

   const debouncedSearch = useCallback(
    (term) => {
       onSearch(term)
    },
    [onSearch],
  )

   useEffect(() => {
     if (localSearchTerm !== searchTerm) {
       const timer = setTimeout(() => {
        debouncedSearch(localSearchTerm)
      }, 300)

      return () => {
         clearTimeout(timer)
      }
    }
  }, [localSearchTerm, searchTerm, debouncedSearch])

   useEffect(() => {
    if (searchTerm !== localSearchTerm) {
       setLocalSearchTerm(searchTerm)
    }
  }, [searchTerm, localSearchTerm])

  const handleGenreChange = (e) => {
     onGenreFilter(e.target.value)
  }

  const handleStatusChange = (e) => {
     onStatusFilter(e.target.value)
  }

  const handleClearFilters = () => {
     setLocalSearchTerm("")
    onSearch("")
    onGenreFilter("")
    onStatusFilter("")
  }

  return (
    <div className=" p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search books..."
              value={localSearchTerm}
              onChange={(e) => {
                 setLocalSearchTerm(e.target.value)
              }}
              className="input-field pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Genre Filter */}
        <div>
          
          <select id="genre-filter" value={genreFilter} onChange={handleGenreChange} className="select-field ">
            <option className="" value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
         
          <select id="status-filter" value={statusFilter} onChange={handleStatusChange} className="select-field">
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(searchTerm || genreFilter || statusFilter) && (
        <div className="flex justify-end">
          <button onClick={handleClearFilters} className="text-sm text-blue-600 hover:text-blue-800">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
