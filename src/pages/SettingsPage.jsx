import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ThemeToggle from '../components/common/ThemeToggle'
import { setMonthlyBudget } from '../redux/slices/settingsSlice'
import { formatCurrency } from '../utils/formatters'

const SettingsPage = () => {
  const dispatch = useDispatch()
  const monthlyBudget = useSelector((state) => state.settings.monthlyBudget)
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget || ''))
  const [message, setMessage] = useState('')

  const handleSaveBudget = (event) => {
    event.preventDefault()
    const parsed = Number(budgetInput)

    if (Number.isNaN(parsed) || parsed < 0) {
      setMessage('Please enter a valid positive number for budget.')
      return
    }

    dispatch(setMonthlyBudget(parsed))
    setMessage('Budget saved successfully.')
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-lg font-semibold">Monthly Budget</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Current budget: {formatCurrency(monthlyBudget)}
        </p>

        <form className="mt-4 space-y-3" onSubmit={handleSaveBudget}>
          <label className="block text-sm">
            Set budget amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={budgetInput}
              onChange={(event) => setBudgetInput(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </label>

          {message ? (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save Budget
          </button>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Toggle light/dark theme for comfortable tracking.
        </p>

        <div className="mt-4">
          <ThemeToggle />
        </div>
      </article>
    </section>
  )
}

export default SettingsPage
