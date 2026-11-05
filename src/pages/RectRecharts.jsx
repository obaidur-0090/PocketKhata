import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const money = (value) => `৳${Number(value).toLocaleString('en-BD')}`

export default function RectRecharts({ customers }) {
  const [range, setRange] = useState('6 months')
  const totals = useMemo(() => {
    if (range === '6 months') {
      const months = Array.from({ length: 6 }, (_, index) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (5 - index))
        return { month: date.toLocaleString('en', { month: 'short' }), due: 0, collected: 0 }
      })
      customers.forEach((customer) => customer.history.forEach((item) => {
        const date = new Date(`${item.date}T00:00:00`)
        const offset = (date.getFullYear() - new Date().getFullYear()) * 12 + date.getMonth() - new Date().getMonth()
        const index = 5 + offset
        if (index >= 0 && index < months.length) months[index][item.type === 'Payment' ? 'collected' : 'due'] += item.amount
      }))
      return months
    }

    const now = new Date()
    now.setHours(23, 59, 59, 999)
    const start = new Date(now)
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0, 0)
    const days = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index * 6)
      return { month: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }), due: 0, collected: 0 }
    })
    customers.forEach((customer) => customer.history.forEach((item) => {
      const date = new Date(`${item.date}T00:00:00`)
      const dayOffset = Math.floor((date - start) / 86400000)
      if (dayOffset >= 0 && dayOffset < 30) {
        const index = Math.min(4, Math.floor(dayOffset / 6))
        days[index][item.type === 'Payment' ? 'collected' : 'due'] += item.amount
      }
    }))
    return days
  }, [customers, range])

  return (
    <article className="panel chart-panel">
      <div className="panel-heading"><div><span className="eyebrow">CASH FLOW</span><h2>Due & collections</h2></div><select aria-label="Chart range" value={range} onChange={(event) => setRange(event.target.value)}><option>6 months</option><option>Last 30 days</option></select></div>
      <div className="chart-legend"><span><i className="legend-dot due-dot" /> New dues</span><span><i className="legend-dot collected-dot" /> Collected</span></div>
      <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={totals} margin={{ top: 10, right: 4, left: -14, bottom: 0 }}><defs><linearGradient id="dueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ea493f" stopOpacity={0.14} /><stop offset="95%" stopColor="#ea493f" stopOpacity={0} /></linearGradient><linearGradient id="paidFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2ea987" stopOpacity={0.12} /><stop offset="95%" stopColor="#2ea987" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#f0eeec" strokeDasharray="3 5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#92919a', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`} tick={{ fill: '#92919a', fontSize: 11 }} /><Tooltip formatter={(value) => money(value)} contentStyle={{ borderRadius: 12, border: '1px solid #eee9e6', boxShadow: '0 8px 24px #25171212' }} /><Area type="monotone" dataKey="due" name="New dues" stroke="#e84f45" strokeWidth={2.2} fill="url(#dueFill)" /><Area type="monotone" dataKey="collected" name="Collected" stroke="#2ea987" strokeWidth={2.2} fill="url(#paidFill)" /></AreaChart></ResponsiveContainer></div>
      <div className="chart-footer"><span>Showing activity for the last {range === '6 months' ? '6 months' : '30 days'}</span><span className="chart-footer-dot" /> Updated just now</div>
    </article>
  )
}
