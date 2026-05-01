import { configureStore } from '@reduxjs/toolkit'
import authReducer, { hydrateAuth } from './slices/authSlice'
import expensesReducer, { hydrateExpenses } from './slices/expensesSlice'
import settingsReducer, { hydrateSettings } from './slices/settingsSlice'
import { getFromStorage, setToStorage } from '../services/storageService'
import { STORAGE_KEYS } from '../utils/constants'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    settings: settingsReducer,
  },
})

store.dispatch(
  hydrateAuth(
    getFromStorage(STORAGE_KEYS.AUTH, {
      users: [],
      currentUser: null,
      isAuthenticated: false,
      error: null,
    }),
  ),
)
store.dispatch(hydrateExpenses(getFromStorage(STORAGE_KEYS.EXPENSES, { items: [] })))
store.dispatch(
  hydrateSettings(
    getFromStorage(STORAGE_KEYS.SETTINGS, { monthlyBudget: 2000, theme: 'light' }),
  ),
)

store.subscribe(() => {
  const state = store.getState()

  // Persist only needed auth fields; avoid persisting transient error state.
  setToStorage(STORAGE_KEYS.AUTH, {
    users: state.auth.users,
    currentUser: state.auth.currentUser,
    isAuthenticated: state.auth.isAuthenticated,
    error: null,
  })
  setToStorage(STORAGE_KEYS.EXPENSES, { items: state.expenses.items })
  setToStorage(STORAGE_KEYS.SETTINGS, {
    monthlyBudget: state.settings.monthlyBudget,
    theme: state.settings.theme,
  })
})
