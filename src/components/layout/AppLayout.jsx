import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LogOut, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { logout } from '../../redux/slices/authSlice'

const AppLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col md:flex-row md:p-5">
        <Sidebar />

        <main className="flex-1 bg-white/95 p-4 shadow-sm md:rounded-r-3xl md:border md:border-slate-200/70 md:p-6 dark:bg-slate-950 dark:md:border-slate-800">
          <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <label className="relative block w-full max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search expenses, categories..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none ring-indigo-200 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
