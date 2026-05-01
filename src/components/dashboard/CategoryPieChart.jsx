import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

const COLORS = ['#6366f1', '#22c55e', '#eab308', '#f97316', '#ef4444', '#0ea5e9', '#8b5cf6', '#14b8a6']

const CategoryPieChart = ({ data, rows = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h3 className="mb-4 text-lg font-semibold">Expenses by Category</h3>

      <div className="grid gap-4 md:grid-cols-[230px_1fr] md:items-center">
        <div className="h-52 md:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={1}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="space-y-2 text-sm">
          {rows.map((row, index) => (
            <li key={row.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="min-w-0 flex-1 truncate text-slate-600 dark:text-slate-300">
                {row.name}
              </span>
              <span className="w-12 text-right text-slate-500 dark:text-slate-400">{row.percent}%</span>
              <span className="w-24 text-right font-medium text-slate-700 dark:text-slate-100">
                {formatCurrency(row.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategoryPieChart
