import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentPage: 1,
  searchTerm: "",
  genreFilter: "",
  statusFilter: "",
}

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setGenreFilter: (state, action) => {
      state.genreFilter = action.payload
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
    },
  },
})

export const { setCurrentPage, setSearchTerm, setGenreFilter, setStatusFilter } = booksSlice.actions
export default booksSlice.reducer
