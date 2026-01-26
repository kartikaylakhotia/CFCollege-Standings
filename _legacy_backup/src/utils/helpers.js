/**
 * Format date to readable string
 */
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

/**
 * Format date for input fields
 */
export function formatDateInput(date) {
    return new Date(date).toISOString().split('T')[0]
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
    return new Date().toISOString().split('T')[0]
}

/**
 * Get relative time string
 */
export function getRelativeTime(date) {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
}

/**
 * Get Codeforces problem URL
 */
export function getProblemUrl(contestId, index) {
    return `https://codeforces.com/problemset/problem/${contestId}/${index}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Get rating badge color (for CSS background)
 */
export function getRatingBadgeStyle(rating) {
    if (!rating) return { background: 'rgba(128, 128, 128, 0.2)', color: '#808080' }
    if (rating < 1200) return { background: 'rgba(128, 128, 128, 0.2)', color: '#808080' }
    if (rating < 1400) return { background: 'rgba(0, 128, 0, 0.2)', color: '#00c000' }
    if (rating < 1600) return { background: 'rgba(3, 168, 158, 0.2)', color: '#03a89e' }
    if (rating < 1900) return { background: 'rgba(0, 0, 255, 0.2)', color: '#5555ff' }
    if (rating < 2100) return { background: 'rgba(170, 0, 170, 0.2)', color: '#aa00aa' }
    if (rating < 2400) return { background: 'rgba(255, 140, 0, 0.2)', color: '#ff8c00' }
    if (rating < 3000) return { background: 'rgba(255, 0, 0, 0.2)', color: '#ff0000' }
    return { background: 'rgba(255, 0, 0, 0.3)', color: '#ff0000' }
}

/**
 * Generate heatmap level (0-4) based on count
 */
export function getHeatmapLevel(count) {
    if (count === 0) return 0
    if (count === 1) return 1
    if (count === 2) return 2
    if (count <= 4) return 3
    return 4
}

/**
 * Format number with K/M suffix
 */
export function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

/**
 * Generate array of dates for heatmap
 */
export function generateHeatmapDates(days = 365) {
    const dates = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        dates.push(date.toISOString().split('T')[0])
    }

    return dates
}
