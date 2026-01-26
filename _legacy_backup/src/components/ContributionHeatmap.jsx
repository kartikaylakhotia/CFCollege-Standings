import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { generateHeatmapDates, getHeatmapLevel } from '../utils/helpers'

export default function ContributionHeatmap({ data }) {
    const dates = useMemo(() => generateHeatmapDates(365), [])

    // Group by weeks
    const weeks = useMemo(() => {
        const result = []
        let currentWeek = []

        dates.forEach((date, index) => {
            const dayOfWeek = new Date(date).getDay()

            // Start a new week on Sunday
            if (dayOfWeek === 0 && currentWeek.length > 0) {
                result.push(currentWeek)
                currentWeek = []
            }

            currentWeek.push({
                date,
                count: data?.[date] || 0,
                dayOfWeek,
            })
        })

        if (currentWeek.length > 0) {
            result.push(currentWeek)
        }

        return result
    }, [dates, data])

    const months = useMemo(() => {
        const result = []
        let currentMonth = null

        dates.forEach((date, index) => {
            const month = new Date(date).getMonth()
            if (month !== currentMonth) {
                result.push({
                    name: new Date(date).toLocaleDateString('en-US', { month: 'short' }),
                    index: Math.floor(index / 7),
                })
                currentMonth = month
            }
        })

        return result
    }, [dates])

    const totalSolves = Object.values(data || {}).reduce((a, b) => a + b, 0)
    const daysActive = Object.values(data || {}).filter(v => v > 0).length

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-100">
                    Contribution Graph
                </h3>
                <div className="flex items-center gap-6 text-sm">
                    <div>
                        <span className="text-zinc-500">Total: </span>
                        <span className="text-zinc-200 font-medium">{totalSolves} solves</span>
                    </div>
                    <div>
                        <span className="text-zinc-500">Active: </span>
                        <span className="text-zinc-200 font-medium">{daysActive} days</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                {/* Month labels */}
                <div className="flex mb-2 pl-8">
                    {months.map((month, i) => (
                        <div
                            key={i}
                            className="text-xs text-zinc-500"
                            style={{
                                position: 'relative',
                                left: `${month.index * 14}px`,
                                width: i < months.length - 1
                                    ? `${(months[i + 1]?.index - month.index) * 14}px`
                                    : 'auto',
                            }}
                        >
                            {month.name}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1">
                    {/* Day labels */}
                    <div className="flex flex-col gap-1 mr-2 text-xs text-zinc-500">
                        <span style={{ height: '12px' }}></span>
                        <span style={{ height: '12px', lineHeight: '12px' }}>Mon</span>
                        <span style={{ height: '12px' }}></span>
                        <span style={{ height: '12px', lineHeight: '12px' }}>Wed</span>
                        <span style={{ height: '12px' }}></span>
                        <span style={{ height: '12px', lineHeight: '12px' }}>Fri</span>
                        <span style={{ height: '12px' }}></span>
                    </div>

                    {/* Heatmap grid */}
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day) => (
                                <motion.div
                                    key={day.date}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: weekIndex * 0.01 }}
                                    className={`heatmap-cell heatmap-level-${getHeatmapLevel(day.count)}`}
                                    title={`${day.date}: ${day.count} solve${day.count !== 1 ? 's' : ''}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-zinc-500">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div key={level} className={`heatmap-cell heatmap-level-${level}`} />
                ))}
                <span>More</span>
            </div>
        </motion.div>
    )
}
