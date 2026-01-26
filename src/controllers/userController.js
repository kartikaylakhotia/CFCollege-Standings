const POTD = require('../models/POTD');
const { getUserInfo, checkUserSolves } = require('../utils/codeforces');

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private (Approved Users)
const getDashboard = async (req, res) => {
    try {
        // 1. Get latest POTD
        const latestPOTD = await POTD.findOne().sort({ dateAssigned: -1 });
        let potdData = null;
        let isSolved = false;

        if (latestPOTD) {
            potdData = latestPOTD;
            // Check if user has solved it
            // We can check our local DB 'solvedProblems' array first
            if (req.user.solvedProblems.includes(latestPOTD.problemId)) {
                isSolved = true;
            } else {
                // Double check with CF API just in case (optional, but good for real-time)
                // Use the utility
                isSolved = await checkUserSolves(req.user.cfHandle, latestPOTD.problemId);

                // If solved now but wasn't in DB, update DB
                if (isSolved) {
                    req.user.solvedProblems.push(latestPOTD.problemId);
                    await req.user.save();
                }
            }
        }

        // 2. Get User CF Stats
        const cfInfo = await getUserInfo(req.user.cfHandle);

        res.json({
            success: true,
            user: {
                name: req.user.name,
                handle: req.user.cfHandle,
                solvedCount: req.user.solvedProblems.length
            },
            cfStats: cfInfo ? {
                rating: cfInfo.rating,
                rank: cfInfo.rank,
                maxRating: cfInfo.maxRating,
                avatar: cfInfo.avatar
            } : null,
            potd: potdData ? {
                problemId: potdData.problemId,
                dateAssigned: potdData.dateAssigned,
                isSolved
            } : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getDashboard
};
