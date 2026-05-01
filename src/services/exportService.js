export const exportExpensesToCSV = (expenses = []) => {
  const headers = ['Amount', 'Category', 'Date', 'Notes']
  const rows = expenses.map((expense) => [
    expense.amount,
    expense.category,
    expense.date,
    (expense.notes || '').replaceAll(',', ';'),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((item) => `"${item ?? ''}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `expenses-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
