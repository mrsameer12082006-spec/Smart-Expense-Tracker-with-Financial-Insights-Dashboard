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

      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        username: name.toLowerCase().replace(/\s+/g, '_'),
        phone: '',
        location: '',
        occupation: '',
        dateOfBirth: '',
        bio: '',
        gender: '',
      }
      state.users.push(newUser)
      state.currentUser = {
        id: newUser.id,
        name,
        email,
        username: newUser.username,
        phone: newUser.phone,
        location: newUser.location,
        occupation: newUser.occupation,
        dateOfBirth: newUser.dateOfBirth,
        bio: newUser.bio,
        gender: newUser.gender,
      }
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
        username: foundUser.username,
        phone: foundUser.phone,
        location: foundUser.location,
        occupation: foundUser.occupation,
        dateOfBirth: foundUser.dateOfBirth,
        bio: foundUser.bio,
        gender: foundUser.gender,
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
    updateProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        const userIndex = state.users.findIndex((u) => u.id === state.currentUser.id)
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], ...action.payload }
        }
      }
    },
  },
})

export const { signup, login, logout, clearAuthError, hydrateAuth, updateProfile } = authSlice.actions
export default authSlice.reducer
