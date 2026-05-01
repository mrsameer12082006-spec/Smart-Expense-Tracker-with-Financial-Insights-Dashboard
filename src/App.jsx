import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'))
const BudgetPage = lazy(() => import('./pages/BudgetPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function App() {
  const theme = useSelector((state) => state.settings.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          Loading Smart Expense Tracker...
        </div>
      }
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
