import { useUserStocks, usePortfolioTotals } from '../hooks/useUserStocks'
import { useCurrentCurrency } from '../stores/useCurrencyStore'
import { useConvert } from '../hooks/useExchangeRates'
import { useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

const SLICE_COLORS = [
  'var(--primary-color)',
  'var(--profit-color)',
  '#5B9BD5',
  'var(--loss-color)',
  '#F4B942',
  '#9B59B6',
  '#1ABC9C',
  '#3498DB',
  '#E74C3C',
]

const AllocationCard = () => {
  const { holdings } = useUserStocks()
  const { totalValue } = usePortfolioTotals()
  const convert = useConvert()
  const displayCurrency = useCurrentCurrency()

  const allocationData = useMemo(() => {
    return holdings
      .map((h) => {
        const normalizedValue = convert(h.totalValue, h.currency)

        return {
          name: h.ticker,
          value: normalizedValue,
          percentage:
            totalValue > 0 ? (normalizedValue / totalValue) * 100 : 0,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [holdings, totalValue, convert])

  const chartData = useMemo(
    () => allocationData.filter((d) => d.value > 0),
    [allocationData]
  )

  const formatMoney = (amount) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: displayCurrency,
    }).format(amount)

  const showEmpty = holdings.length === 0 || totalValue <= 0
  const showNoSlices = !showEmpty && chartData.length === 0

  return (
    <div className="card allocation-card">
      <h3 className="card-title">Asset Allocation</h3>
      {showEmpty ? (
        <p className="empty-state">Add holdings to see allocation.</p>
      ) : showNoSlices ? (
        <p className="empty-state">No positive positions to chart.</p>
      ) : (
        <div className="allocation-chart">
          <div className="allocation-pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="42%"
                  cy="50%"
                  outerRadius={72}
                  paddingAngle={1}
                  label={false}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => {
                    const pct = item?.payload?.percentage
                    const pctStr =
                      typeof pct === 'number' ? `${pct.toFixed(1)}%` : ''
                    return [
                      `${pctStr}${pctStr ? ' · ' : ''}${formatMoney(value)}`,
                      name,
                    ]
                  }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value, entry) => {
                    const pct = entry?.payload?.percentage
                    const pctStr =
                      typeof pct === 'number' ? `${pct.toFixed(1)}%` : ''
                    return `${value} (${pctStr})`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllocationCard
