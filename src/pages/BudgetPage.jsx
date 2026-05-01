import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { AlertCircle, Wallet, TrendingDown, PiggyBank, BarChart3 } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'

const BudgetPage = () => {
  const expenses = useSelector((state) => state.expenses.items)
  const monthlyBudget = useSelector((state) => state.settings.monthlyBudget)
  const currency = useSelector((state) => state.settings.currency)

  const {
    currentMonthTotal,
    amountLeft,
    amountLeftPercent,
    usedPercent,
    dailyAverage,
    categoryBudgets,
    exceedingCategories,
    budgetHistory,
  } = useMemo(() => {
    const now = new Date()
    const currentMonthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    const total = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    const left = Number(monthlyBudget) - total
    const leftPercent = monthlyBudget > 0 ? (left / Number(monthlyBudget)) * 100 : 0
    const used = monthlyBudget > 0 ? (total / Number(monthlyBudget)) * 100 : 0
    const avg = total / Math.max(1, now.getDate())

    const categoryMap = {}
    currentMonthExpenses.forEach((expense) => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + Number(expense.amount)
    })

    const budgetPerCategory = monthlyBudget > 0 ? Number(monthlyBudget) / Object.keys(categoryMap).length : 0
    
    const categoryBudgets = Object.entries(categoryMap)
      .map(([category, spent]) => ({
        category,
        budget: budgetPerCategory,
        spent,
        progress: budgetPerCategory > 0 ? Math.min(100, (spent / budgetPerCategory) * 100) : 0,
      }))
      .sort((a, b) => b.spent - a.spent)

    const exceeding = categoryBudgets.filter((cb) => cb.spent > cb.budget)

    const previousMonths = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      const monthExpenses = expenses.filter((expense) => {
        const date = new Date(expense.date)
        return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
      })
      const monthTotal = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      previousMonths.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        amount: monthTotal,
      })
    }

    return {
      currentMonthTotal: total,
      amountLeft: Math.max(0, left),
      amountLeftPercent: leftPercent,
      usedPercent: Math.min(100, used),
      dailyAverage: avg,
      categoryBudgets,
      exceedingCategories: exceeding,
      budgetHistory: previousMonths,
    }
  }, [expenses, monthlyBudget])

  const pieData = [
    { name: 'Spent', value: currentMonthTotal },
    { name: 'Left', value: amountLeft },
  ]

  const chartData = categoryBudgets.map((cb) => ({
    name: cb.category,
    Budget: cb.budget,
    Actual: cb.spent,
  }))

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Budget</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Plan your spending and track your budget progress
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Wallet}
          tone="indigo"
          title="Total Budget"
          value={formatCurrency(monthlyBudget, currency)}
          subtitle="Monthly Budget"
        />
        <MetricCard
          icon={TrendingDown}
          tone="green"
          title="Total Spent"
          value={formatCurrency(currentMonthTotal, currency)}
          subtitle={`${Math.round(usedPercent)}% of Budget`}
        />
        <MetricCard
          icon={PiggyBank}
          tone="amber"
          title="Amount Left"
          value={formatCurrency(amountLeft, currency)}
          subtitle={`${Math.round(amountLeftPercent)}% of Budget`}
        />
        <MetricCard
          icon={BarChart3}
          tone="rose"
          title="Daily Average Spent"
          value={formatCurrency(dailyAverage, currency)}
          subtitle="This Month"
        />
      </div>

      {exceedingCategories.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-900/20">
          {exceedingCategories.map((category) => (
            <div key={category.category} className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-rose-600 dark:text-rose-300" />
              <p className="text-sm text-rose-700 dark:text-rose-200">
                You have exceeded your <strong>{category.category}</strong> budget by{' '}
                <strong>{formatCurrency(category.spent - category.budget, currency)}</strong>.
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Budget Overview</h3>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              May 2026
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <div className="relative" style={{ width: '200px', height: '200px' }}>
                <PieChart width={200} height={200}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#cbd5e1" />
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(usedPercent)}%
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Used</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">Spent</p>
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(currentMonthTotal, currency)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">Left</p>
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(amountLeft, currency)}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Budget</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(monthlyBudget, currency)}
                </p>
              </div>
            </div>

            {usedPercent <= 100 ? (
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                <div className="flex gap-2">
                  <div className="flex-shrink-0">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      Great! You're within your budget.
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Keep it up and try to save more this month.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
                <div className="flex gap-2">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                      Budget exceeded!
                    </p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      You've spent {formatCurrency(currentMonthTotal - monthlyBudget)} over your budget.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Budget vs Actual</h3>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              This Month
            </button>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#cbd5e1" opacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Legend />
              <Bar dataKey="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Budget by Category</h3>
            <button
              type="button"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400"
            >
              Manage Budget
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 text-right font-semibold">Budget</th>
                <th className="px-4 py-3 text-right font-semibold">Spent</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {categoryBudgets.map((cb) => (
                <tr key={cb.category} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {cb.category}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                    {formatCurrency(cb.budget, currency)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(cb.spent, currency)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-full rounded-full ${
                            cb.progress > 100 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, cb.progress)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {Math.round(cb.progress)}%
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Budget History</h3>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Last 6 Months
          </button>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={budgetHistory}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#cbd5e1" opacity={0.5} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
            />
            <Tooltip formatter={(value) => formatCurrency(value, currency)} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </article>
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
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </article>
  )
}

export default BudgetPage
