import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CalendarDays, Lightbulb, PiggyBank, Wallet, TrendingUp } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import TrendLineChart from '../components/dashboard/TrendLineChart'
import EmptyState from '../components/common/EmptyState'
import { getDashboardInsights } from '../services/insightsService'
import { formatCurrency, formatDate } from '../utils/formatters'

const DashboardPage = () => {
  const expenses = useSelector((state) => state.expenses.items)
  const monthlyBudget = useSelector((state) => state.settings.monthlyBudget)
  const currentUser = useSelector((state) => state.auth.currentUser)

  const {
    monthlyTotal,
    pieData,
    trendData,
    recentTransactions,
    categoryRows,
    topCategory,
    monthComparison,
    budgetRemaining,
    budgetUsedPercent,
    monthlyLabel,
  } = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1)
    const previousMonth = previousMonthDate.getMonth()
    const previousYear = previousMonthDate.getFullYear()

    const currentMonthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const previousMonthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear
    })

    const monthlyTotal = currentMonthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    )

    const pieData = Object.entries(
      currentMonthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
        return acc
      }, {}),
    ).map(([name, value]) => ({ name, value }))

    const trendMap = currentMonthExpenses.reduce((acc, expense) => {
      const day = new Date(expense.date).getDate()
      acc[day] = (acc[day] || 0) + Number(expense.amount)
      return acc
    }, {})

    const trendData = Object.entries(trendMap)
      .map(([day, amount]) => ({ day: Number(day), amount, label: `${day} ${monthlyLabelShort(now)}` }))
      .sort((a, b) => Number(a.day) - Number(b.day))

    const insights = getDashboardInsights({ currentMonthExpenses, previousMonthExpenses })

    const sortedByAmount = [...pieData].sort((a, b) => b.value - a.value)
    const categoryRows = sortedByAmount.map((item) => ({
      ...item,
      percent: monthlyTotal ? Math.round((item.value / monthlyTotal) * 100) : 0,
    }))

    const recentTransactions = [...currentMonthExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    const budgetUsedPercent = monthlyBudget > 0 ? (monthlyTotal / Number(monthlyBudget)) * 100 : 0

    const monthlyLabel = now.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    return {
      monthlyTotal,
      pieData,
      trendData,
      recentTransactions,
      categoryRows,
      topCategory: insights.topCategory,
      monthComparison: insights.monthComparison,
      budgetRemaining: Number(monthlyBudget) - monthlyTotal,
      budgetUsedPercent,
      monthlyLabel,
    }
  }, [expenses, monthlyBudget])

  if (!expenses.length) {
    return (
      <EmptyState
        title="No expenses to visualize yet"
        description="Add a few expenses from the Expenses page to unlock chart insights and trends."
      />
    )
  }

  const totalIncome = Number(monthlyBudget)
  const totalSavings = Math.max(0, budgetRemaining)

  const smartInsights = [
    `Your top category this month is ${topCategory}.`,
    monthComparison,
    budgetRemaining < 0
      ? `You are over budget by ${formatCurrency(Math.abs(budgetRemaining))}.`
      : `You still have ${formatCurrency(budgetRemaining)} available in your budget.`,
  ]

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, {currentUser?.name || 'User'}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here&apos;s what&apos;s happening with your finances today.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <CalendarDays size={16} />
          {monthlyLabel}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <StatCard
          label="Total Expenses"
          value={formatCurrency(monthlyTotal)}
          hint={`from ${monthlyLabel}`}
          trend="12.5% up"
          icon={Wallet}
          tone="soft"
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          hint="Configured monthly budget"
          trend="8.3% up"
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Total Savings"
          value={formatCurrency(totalSavings)}
          hint={budgetRemaining < 0 ? 'Negative savings this month' : 'Projected monthly savings'}
          trend="5.7% up"
          icon={PiggyBank}
          tone="amber"
        />
        <StatCard
          label="Monthly Budget"
          value={formatCurrency(monthlyBudget)}
          progress={budgetUsedPercent}
          progressLabel={`${Math.round(budgetUsedPercent)}% used`}
          icon={CalendarDays}
          tone={budgetUsedPercent > 100 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {trendData.length ? (
          <TrendLineChart data={trendData} />
        ) : (
          <EmptyState
            title="No trend data"
            description="Add expenses across multiple days to see a monthly overview trend."
          />
        )}

        {pieData.length ? (
          <CategoryPieChart data={pieData} rows={categoryRows} />
        ) : (
          <EmptyState
            title="No category data"
            description="Add expenses in this month to see category distribution."
          />
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">View All</span>
          </div>

          <div className="space-y-2">
            {recentTransactions.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {expense.notes?.trim() || `${expense.category} Expense`}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{expense.category}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(expense.amount)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(expense.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <h3 className="text-lg font-semibold">Smart Insights</h3>
          </div>

          <div className="space-y-2">
            {smartInsights.map((insight) => (
              <div
                key={insight}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {insight}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

const monthlyLabelShort = (date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
  })

export default DashboardPage
