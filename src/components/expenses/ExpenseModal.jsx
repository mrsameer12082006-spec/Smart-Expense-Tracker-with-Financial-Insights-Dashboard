import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants'

const defaultFormState = {
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'UPI',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
}

const ExpenseModal = ({ open, onClose, onSave, initialExpense }) => {
  const currency = useSelector((state) => state.settings.currency)
  const [form, setForm] = useState(defaultFormState)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialExpense) {
      setForm({
        title: initialExpense.title || '',
        amount: initialExpense.amount,
        category: initialExpense.category,
        paymentMethod: initialExpense.paymentMethod || 'UPI',
        date: initialExpense.date,
        notes: initialExpense.notes || '',
      })
    } else {
      setForm(defaultFormState)
    }
    setError('')
  }, [initialExpense, open])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be greater than 0.')
      return
    }

    if (!form.category || !form.date) {
      setError('Category and date are required.')
      return
    }

    if (!form.paymentMethod) {
      setError('Payment method is required.')
      return
    }

    onSave({
      ...form,
      title: form.title.trim(),
      amount: Number(form.amount),
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900"
      >
        <h3 className="mb-4 text-xl font-semibold">
          {initialExpense ? 'Edit Expense' : 'Add New Expense'}
        </h3>

        {error ? (
          <p className="mb-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            Title
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g. Grocery shopping"
            />
          </label>

          <label className="text-sm">
            Amount ({currency})
            <input
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.amount}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, amount: event.target.value }))
              }
              required
            />
          </label>

          <label className="text-sm">
            Category
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm sm:col-span-2">
            Payment Method
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.paymentMethod}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, paymentMethod: event.target.value }))
              }
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm sm:col-span-2">
            Date
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              required
            />
          </label>

          <label className="text-sm sm:col-span-2">
            Notes
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.notes}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Optional notes"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseModal
