import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

const TrendLineChart = ({ data }) => {
  return (
    <div className="h-[340px] rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Expense Overview</h3>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          This Month
        </button>
      </div>

      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#cbd5e1" opacity={0.5} />
          <XAxis
            dataKey="label"
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
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#4f75ff"
            strokeWidth={3}
            dot={{ r: 4, fill: '#4f75ff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendLineChart
