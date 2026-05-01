export const getDashboardInsights = ({ currentMonthExpenses, previousMonthExpenses }) => {
  if (!currentMonthExpenses.length) {
    return {
      topCategory: 'No expenses yet',
      monthComparison: 'Start adding expenses to unlock insights.',
    }
  }

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
    return acc
  }, {})

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const previousTotal = previousMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  if (previousTotal === 0) {
    return {
      topCategory,
      monthComparison: 'No previous month data available for comparison.',
    }
  }

  const diff = currentTotal - previousTotal
  const percentage = Math.abs((diff / previousTotal) * 100).toFixed(1)
  const direction = diff > 0 ? 'increased' : 'decreased'

  return {
    topCategory,
    monthComparison: `Spending ${direction} by ${percentage}% compared to last month.`,
  }
}
