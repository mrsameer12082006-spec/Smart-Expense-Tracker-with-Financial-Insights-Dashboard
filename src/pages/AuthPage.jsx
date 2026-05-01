import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { clearAuthError, login, signup } from '../redux/slices/authSlice'

const AuthPage = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, error } = useSelector((state) => state.auth)

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    dispatch(clearAuthError())
    setFormError('')
  }, [dispatch, mode])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.email.includes('@')) {
      setFormError('Please provide a valid email address.')
      return
    }

    if ((form.password || '').length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    if (mode === 'signup') {
      if (!form.name.trim()) {
        setFormError('Name is required for signup.')
        return
      }

      dispatch(
        signup({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      )
      return
    }

    dispatch(
      login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    )
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Smart Expense Tracker
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {mode === 'login'
            ? 'Welcome back! Log in to continue.'
            : 'Create an account to start tracking smarter.'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              mode === 'login'
                ? 'bg-white text-indigo-600 shadow dark:bg-slate-900 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              mode === 'signup'
                ? 'bg-white text-indigo-600 shadow dark:bg-slate-900 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Signup
          </button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label className="block text-sm">
              Name
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>
          ) : null}

          <label className="block text-sm">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </label>

          <label className="block text-sm">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
          </label>

          {formError || error ? (
            <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              {formError || error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage
