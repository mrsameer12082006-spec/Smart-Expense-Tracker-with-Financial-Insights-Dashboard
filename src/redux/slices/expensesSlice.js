import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.items.unshift({ id: crypto.randomUUID(), ...action.payload })
    },
    updateExpense: (state, action) => {
      const { id, updatedValues } = action.payload
      const targetIndex = state.items.findIndex((expense) => expense.id === id)
      if (targetIndex >= 0) {
        state.items[targetIndex] = { ...state.items[targetIndex], ...updatedValues }
      }
    },
    deleteExpense: (state, action) => {
      state.items = state.items.filter((expense) => expense.id !== action.payload)
    },
    hydrateExpenses: (state, action) => {
      return { ...state, ...action.payload }
    },
    clearExpenses: (state) => {
      state.items = []
    },
  },
})

export const { addExpense, updateExpense, deleteExpense, hydrateExpenses, clearExpenses } =
  expensesSlice.actions
export default expensesSlice.reducer
