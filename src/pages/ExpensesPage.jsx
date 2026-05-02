import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wallet,
  TrendingDown,
  PiggyBank,
  BarChart3,
  ShoppingBag,
  Car,
  Receipt,
  Clapperboard,
  CircleDollarSign,
  Utensils,
} from 'lucide-react'
import ExpenseModal from '../components/expenses/ExpenseModal'
import EmptyState from '../components/common/EmptyState'
import { addExpense, deleteExpense, updateExpense } from '../redux/slices/expensesSlice'
import { EXPENSE_CATEGORIES, PAGE_SIZE, PAYMENT_METHODS } from '../utils/constants'
import { formatCurrency, formatDate, convertCurrency } from '../utils/formatters'
import { useDebounce } from '../hooks/useDebounce'
import { exportExpensesToCSV } from '../services/exportService'

const categoryStyles = {
  Food: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Travel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Bills: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Shopping: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Health: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Education: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

const categoryIcons = {
  Food: Utensils,
  Travel: Car,
  Bills: CircleDollarSign,
  Shopping: ShoppingBag,
  Entertainment: Clapperboard,
  Health: Receipt,
  Education: Receipt,
  Other: Receipt,
}

const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getMonthStartDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}-01`
}

const ExpensesPage = () => {
  const dispatch = useDispatch()
  const expenses = useSelector((state) => state.expenses.items)
  const monthlyBudget = useSelector((state) => state.settings.monthlyBudget)
  const monthlyIncome = useSelector((state) => state.settings.monthlyIncome)
  const currency = useSelector((state) => state.settings.currency)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods')
  const [startDate, setStartDate] = useState(getMonthStartDate())
  const [endDate, setEndDate] = useState(getTodayDate())
  const [sortBy, setSortBy] = useState('date-desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const debouncedSearch = useDebounce(searchTerm, 350)

  const filteredExpenses = useMemo(() => {
    const result = expenses
      .filter((expense) =>
        categoryFilter === 'All' ? true : expense.category === categoryFilter,
      )
      .filter((expense) => {
        if (paymentFilter === 'All Payment Methods') return true
        return (expense.paymentMethod || 'UPI') === paymentFilter
      })
      .filter((expense) => {
        if (!startDate) return true
        return new Date(expense.date) >= new Date(startDate)
      })
      .filter((expense) => {
        if (!endDate) return true
        return new Date(expense.date) <= new Date(endDate)
      })
      .filter((expense) => {
        if (!debouncedSearch.trim()) return true
        const query = debouncedSearch.toLowerCase()
        return (
          expense.category.toLowerCase().includes(query) ||
          (expense.title || '').toLowerCase().includes(query) ||
          (expense.notes || '').toLowerCase().includes(query)
        )
      })

    const sorted = [...result]

    if (sortBy === 'amount-asc') {
      sorted.sort((a, b) => Number(a.amount) - Number(b.amount))
    } else if (sortBy === 'amount-desc') {
      sorted.sort((a, b) => Number(b.amount) - Number(a.amount))
    } else if (sortBy === 'date-asc') {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return sorted
  }, [
    expenses,
    categoryFilter,
    paymentFilter,
    startDate,
    endDate,
    debouncedSearch,
    sortBy,
  ])

  const { currentMonthTotal, averageDailyExpense } = useMemo(() => {
    const now = new Date()
    const currentMonthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    const total = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    return {
      currentMonthTotal: total,
      averageDailyExpense: total / Math.max(1, now.getDate()),
    }
  }, [expenses])

  const totalIncome = Number(monthlyIncome)
  const totalSavings = Math.max(0, totalIncome - currentMonthTotal)

  const totalPages = Math.ceil(filteredExpenses.length / pageSize)
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginationNumbers = useMemo(() => {
    const spread = 3
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages, start + spread - 1)
    const adjustedStart = Math.max(1, end - spread + 1)

    return Array.from(
      { length: Math.max(0, end - adjustedStart + 1) },
      (_, index) => adjustedStart + index,
    )
  }, [currentPage, totalPages])

  const openCreateModal = () => {
    setSelectedExpense(null)
    setModalOpen(true)
  }

  const openEditModal = (expense) => {
    setSelectedExpense(expense)
    setModalOpen(true)
  }

  const handleSaveExpense = (payload) => {
    // payload.amount is in the currently selected display currency.
    // Convert back to INR for consistent storage (app stores amounts in INR).
    try {
      const { convertCurrency } = require('../utils/formatters')
      const amountInINR = convertCurrency(payload.amount, currency, 'INR')
      const storedPayload = { ...payload, amount: Number(amountInINR) }

      if (selectedExpense) {
        dispatch(updateExpense({ id: selectedExpense.id, updatedValues: storedPayload }))
      } else {
        dispatch(addExpense(storedPayload))
      }
    } catch (e) {
      // fallback: store raw number
      if (selectedExpense) {
        dispatch(updateExpense({ id: selectedExpense.id, updatedValues: payload }))
      } else {
        dispatch(addExpense(payload))
      }
    }

    setModalOpen(false)
    setSelectedExpense(null)
  }

  const handleDelete = (id) => {
    dispatch(deleteExpense(id))
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Expenses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track and manage all your expenses
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportExpensesToCSV(filteredExpenses)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Wallet}
          tone="indigo"
          title="Total Expenses"
          value={formatCurrency(currentMonthTotal)}
          subtitle="This Month"
        />
        <MetricCard
          icon={TrendingDown}
          tone="green"
          title="Total Income"
          value={formatCurrency(totalIncome)}
          subtitle="This Month"
        />
        <MetricCard
          icon={PiggyBank}
          tone="amber"
          title="Total Savings"
          value={formatCurrency(totalSavings)}
          subtitle="This Month"
        />
        <MetricCard
          icon={BarChart3}
          tone="rose"
          title="Avg. Daily Expense"
          value={formatCurrency(averageDailyExpense)}
          subtitle="This Month"
        />
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-12">
        <label className="relative block lg:col-span-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setCurrentPage(1)
              setSearchTerm(event.target.value)
            }}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Search by title, category..."
          />
        </label>

        <label className="lg:col-span-2">
          <select
            value={categoryFilter}
            onChange={(event) => {
              setCurrentPage(1)
              setCategoryFilter(event.target.value)
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-span-2">
          <select
            value={paymentFilter}
            onChange={(event) => {
              setCurrentPage(1)
              setPaymentFilter(event.target.value)
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="All Payment Methods">All Payment Methods</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2 lg:col-span-4">
          <label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setCurrentPage(1)
                setStartDate(event.target.value)
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label>
            <input
              type="date"
              value={endDate}
              onChange={(event) => {
                setCurrentPage(1)
                setEndDate(event.target.value)
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {paginatedExpenses.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Payment Method</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense) => {
                  const Icon = categoryIcons[expense.category] || Receipt

                  return (
                    <tr key={expense.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                            <Icon size={14} />
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {expense.title || expense.notes || `${expense.category} Expense`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            categoryStyles[expense.category] ||
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {expense.paymentMethod || 'UPI'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-rose-600 dark:text-rose-400">
                        -{formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(expense)}
                            className="rounded-lg border border-slate-300 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                            aria-label="Edit expense"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(expense.id)}
                            className="rounded-lg border border-slate-300 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                            aria-label="Delete expense"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              title="No expenses found"
              description="Try adjusting filters or add a new expense to get started."
            />
          </div>
        )}

        {filteredExpenses.length ? (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredExpenses.length)} of{' '}
              {filteredExpenses.length} expenses
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 p-2 text-slate-500 disabled:opacity-40 dark:border-slate-700"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>

              {paginationNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${
                    currentPage === pageNumber
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 p-2 text-slate-500 disabled:opacity-40 dark:border-slate-700"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <label>
              <select
                value={pageSize}
                onChange={(event) => {
                  setCurrentPage(1)
                  setPageSize(Number(event.target.value))
                }}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                {[10, 20, 30].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>

      <ExpenseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedExpense(null)
        }}
        onSave={handleSaveExpense}
        initialExpense={selectedExpense}
      />
    </section>
  )
}

const MetricCard = ({ title, value, subtitle, icon: Icon, tone }) => {
  const tones = {
    indigo: 'border-indigo-100 bg-indigo-50/70 dark:border-indigo-900 dark:bg-indigo-900/20',
    green: 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-900/20',
    amber: 'border-amber-100 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-900/20',
    rose: 'border-rose-100 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-900/20',
  }

  return (
    <article className={`rounded-2xl border p-4 ${tones[tone] || tones.indigo}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">{title}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700">
          <Icon size={16} />
        </span>
      </div>
      <p className="text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </article>
  )
}

export default ExpensesPage
