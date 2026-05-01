import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  currentUser: null,
  isAuthenticated: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (state, action) => {
      const { name, email, password } = action.payload
      const existingUser = state.users.find((user) => user.email === email)

      if (existingUser) {
        state.error = 'User already exists. Please log in.'
        return
      }

      const newUser = { id: crypto.randomUUID(), name, email, password }
      state.users.push(newUser)
      state.currentUser = { id: newUser.id, name, email }
      state.isAuthenticated = true
      state.error = null
    },
    login: (state, action) => {
      const { email, password } = action.payload
      const foundUser = state.users.find(
        (user) => user.email === email && user.password === password,
      )

      if (!foundUser) {
        state.error = 'Invalid email or password.'
        state.isAuthenticated = false
        return
      }

      state.currentUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      }
      state.isAuthenticated = true
      state.error = null
    },
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
    hydrateAuth: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { signup, login, logout, clearAuthError, hydrateAuth } = authSlice.actions
export default authSlice.reducer
