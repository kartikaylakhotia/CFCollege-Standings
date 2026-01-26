const axios = require('axios');

const getUserInfo = async (handle) => {
    try {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (response.data.status === 'OK') {
            return response.data.result[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching CF user info for ${handle}:`, error.message);
        return null;
    }
};

const checkUserSolves = async (handle, problemId) => {
    try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=50`); // Checking last 50 submissions should be enough for "daily" checks usually, or we can increase
        if (response.data.status === 'OK') {
            const submissions = response.data.result;
            // Clean problem ID format if needed (e.g. 123A)
            // CF API returns contestId: 123, index: "A"

            // Extract contest ID and index from problemId string (e.g. "123A")
            // Assuming problemId format matches CF standard (numbers + letter)
            // Robust parsing: match numbers then letters
            const match = problemId.match(/^(\d+)([A-Z]+)$/i);
            if (!match) return false;

            const targetContestId = parseInt(match[1]);
            const targetIndex = match[2].toUpperCase();

            const solved = submissions.some(sub =>
                sub.contestId === targetContestId &&
                sub.problem.index === targetIndex &&
                sub.verdict === 'OK'
            );
            return solved;
        }
        return false;
    } catch (error) {
        console.error(`Error checking solves for ${handle}:`, error.message);
        return false;
    }
};

module.exports = {
    getUserInfo,
    checkUserSolves
};
