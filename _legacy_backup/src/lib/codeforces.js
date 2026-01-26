const CF_API = 'https://codeforces.com/api'

// Rate limiting - max 5 requests per second
let lastCallTime = 0
const MIN_INTERVAL = 250 // 250ms between calls

async function rateLimitedFetch(url) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    if (timeSinceLastCall < MIN_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - timeSinceLastCall))
    }

    lastCallTime = Date.now()
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
        throw new Error(data.comment || 'Codeforces API error')
    }

    return data.result
}

/**
 * Parse Codeforces problem identifier
 * Supports formats: "1955C", "1955/C", "https://codeforces.com/problemset/problem/1955/C"
 */
export function parseProblemId(input) {
    // Clean the input
    const cleaned = input.trim()

    // URL format
    const urlMatch = cleaned.match(/codeforces\.com\/(?:problemset\/problem|contest)\/(\d+)\/([A-Z]\d?)/)
    if (urlMatch) {
        return { contestId: parseInt(urlMatch[1]), index: urlMatch[2] }
    }

    // Direct format with slash: 1955/C
    const slashMatch = cleaned.match(/^(\d+)\/([A-Z]\d?)$/)
    if (slashMatch) {
        return { contestId: parseInt(slashMatch[1]), index: slashMatch[2] }
    }

    // Direct format: 1955C or 1955A1
    const directMatch = cleaned.match(/^(\d+)([A-Z]\d?)$/)
    if (directMatch) {
        return { contestId: parseInt(directMatch[1]), index: directMatch[2] }
    }

    throw new Error('Invalid problem format. Use format like "1955C", "1955/C", or a Codeforces URL')
}

/**
 * Fetch problem metadata from Codeforces
 */
export async function fetchProblemInfo(contestId, index) {
    try {
        // Try contest.standings first (works for most problems)
        const result = await rateLimitedFetch(
            `${CF_API}/contest.standings?contestId=${contestId}&from=1&count=1`
        )

        const problem = result.problems.find(p => p.index === index)

        if (!problem) {
            throw new Error(`Problem ${index} not found in contest ${contestId}`)
        }

        return {
            name: problem.name,
            rating: problem.rating || null,
            tags: problem.tags || [],
            contestId,
            index
        }
    } catch (error) {
        // Fallback: try problemset.problems
        if (error.message.includes('contestId')) {
            const result = await rateLimitedFetch(`${CF_API}/problemset.problems`)
            const problem = result.problems.find(
                p => p.contestId === contestId && p.index === index
            )

            if (!problem) {
                throw new Error(`Problem ${contestId}${index} not found`)
            }

            return {
                name: problem.name,
                rating: problem.rating || null,
                tags: problem.tags || [],
                contestId,
                index
            }
        }
        throw error
    }
}

/**
 * Check if user has solved a specific problem
 */
export async function checkUserSolved(handle, contestId, index) {
    try {
        const result = await rateLimitedFetch(
            `${CF_API}/user.status?handle=${handle}&from=1&count=500`
        )

        return result.some(
            submission =>
                submission.contestId === contestId &&
                submission.problem.index === index &&
                submission.verdict === 'OK'
        )
    } catch (error) {
        console.error('Error checking solve status:', error)
        throw error
    }
}

/**
 * Fetch user info from Codeforces
 */
export async function fetchUserInfo(handle) {
    const result = await rateLimitedFetch(`${CF_API}/user.info?handles=${handle}`)
    return result[0]
}

/**
 * Fetch multiple users' info
 */
export async function fetchUsersInfo(handles) {
    if (handles.length === 0) return []

    const handlesStr = handles.join(';')
    const result = await rateLimitedFetch(`${CF_API}/user.info?handles=${handlesStr}`)
    return result
}

/**
 * Get rating color class based on CF rating
 */
export function getRatingColor(rating) {
    if (!rating) return 'text-gray-400'
    if (rating < 1200) return 'cf-newbie'
    if (rating < 1400) return 'cf-pupil'
    if (rating < 1600) return 'cf-specialist'
    if (rating < 1900) return 'cf-expert'
    if (rating < 2100) return 'cf-candidate-master'
    if (rating < 2400) return 'cf-master'
    if (rating < 3000) return 'cf-grandmaster'
    return 'cf-legendary'
}

/**
 * Get rating tier name
 */
export function getRatingTier(rating) {
    if (!rating) return 'Unrated'
    if (rating < 1200) return 'Newbie'
    if (rating < 1400) return 'Pupil'
    if (rating < 1600) return 'Specialist'
    if (rating < 1900) return 'Expert'
    if (rating < 2100) return 'Candidate Master'
    if (rating < 2400) return 'Master'
    if (rating < 2600) return 'International Master'
    if (rating < 3000) return 'Grandmaster'
    return 'Legendary Grandmaster'
}
