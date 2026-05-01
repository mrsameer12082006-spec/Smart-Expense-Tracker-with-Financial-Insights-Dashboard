import {
  CircleUserRound,
  LayoutDashboard,
  ListPlus,
  ReceiptText,
  Settings,
  Wallet,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ThemeToggle from '../common/ThemeToggle'
import { formatCurrency } from '../../utils/formatters'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { to: '/expenses', label: 'Expenses', icon: ReceiptText, active: true },
  { to: '/expenses', label: 'Add Expense', icon: ListPlus, active: true },
  { to: '/budget', label: 'Budget', icon: Wallet, active: true },
  { to: '/settings', label: 'Settings', icon: Settings, active: true },
]

const Sidebar = () => {
  const currentUser = useSelector((state) => state.auth.currentUser)
  const monthlyBudget = useSelector((state) => state.settings.monthlyBudget)
  const currency = useSelector((state) => state.settings.currency)
  const expenses = useSelector((state) => state.expenses.items)

  const now = new Date()
  const currentMonthSpent = expenses
    .filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0)

  const usedPercent = monthlyBudget
    ? Math.min(100, Math.round((currentMonthSpent / Number(monthlyBudget)) * 100))
    : 0
  const budgetLeft = Number(monthlyBudget) - currentMonthSpent

  return (
    <aside className="flex w-full flex-col border-b border-slate-200/80 bg-white/90 p-4 md:w-72 md:border-r md:border-b-0 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-sm shadow-indigo-500/30">
          <LayoutDashboard size={18} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Smart Expense</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tracker</p>
        </div>
      </div>

      <nav className="flex flex-row gap-2 overflow-x-auto pb-1 md:flex-col">
        {links.map(({ to, label, icon: Icon, active }) => {
          if (!active) {
            return (
              <span
                key={label}
                className="inline-flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 opacity-80 dark:text-slate-400"
              >
                <Icon size={16} />
                {label}
              </span>
            )
          }

          return (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-5">
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/80">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Budget</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(monthlyBudget, currency)}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${usedPercent}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{usedPercent}% Used</span>
            <span>{formatCurrency(budgetLeft, currency)} Left</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/80">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            <CircleUserRound size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {currentUser?.name || 'User'}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {currentUser?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
