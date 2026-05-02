import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  monthlyBudget: 2000,
  monthlyIncome: 5000,
  theme: 'light',
  currency: 'INR',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMonthlyBudget: (state, action) => {
      state.monthlyBudget = Number(action.payload) || 0
    },
    setMonthlyIncome: (state, action) => {
      state.monthlyIncome = Number(action.payload) || 0
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setCurrency: (state, action) => {
      state.currency = action.payload
    },
    hydrateSettings: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setMonthlyBudget, setMonthlyIncome, toggleTheme, setTheme, setCurrency, hydrateSettings } =
  settingsSlice.actions
export default settingsSlice.reducer
