const express = require("express");
const router = express.Router();
const RoundStatus = require("../models/roundStatus"); // Import schema
const TeamResponse = require("../models/TeamResponse"); // Import schema


// Helper function to get current time in HH:mm:ss format
const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
};

// 📌 1️⃣ Start a Round (Does not auto-end, creates schema if not exists)
router.post("/start-round/:round", async (req, res) => {
    const { round } = req.params;

    try {
        const startTime = getCurrentTime();

        let roundStatus = await RoundStatus.findOne({});

        if (!roundStatus) {
            // Create schema if it doesn't exist
            roundStatus = new RoundStatus({
                active_round: round,
                started_at: startTime,
                ended_at: null,
            });
        } else {
            // Update existing schema
            roundStatus.active_round = round;
            roundStatus.started_at = startTime;
            roundStatus.ended_at = null;
        }

        await roundStatus.save();

        res.json({ success: true, message: `Round ${round} started at ${startTime}` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error starting round" });
    }
});

// 📌 2️⃣ Manually End the Round
router.post("/end-round", async (req, res) => {
    try {
        const roundStatus = await RoundStatus.findOne({});
        if (!roundStatus || !roundStatus.active_round) {
            return res.status(400).json({ success: false, message: "No active round to end" });
        }

        roundStatus.active_round = null;
        roundStatus.ended_at = getCurrentTime();
        await roundStatus.save();

        res.json({ success: true, message: `Round manually ended.` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error ending round" });
    }
});

// 📌 3️⃣ Fetch Current Active Round
router.get("/round-status", async (req, res) => {
    try {
        const roundStatus = await RoundStatus.findOne({});
        
        if (!roundStatus || !roundStatus.active_round) {
            return res.json({ active_round: null, started_at: null, ended_at: roundStatus?.ended_at || null });
        }

        res.json({
            active_round: roundStatus.active_round,
            started_at: roundStatus.started_at,
            ended_at: roundStatus.ended_at,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching round status" });
    }
});

router.get('/team-response', async (req ,res, next) => {
    try {
        const teamReponses = await TeamResponse.findOne({team_name: req.session.teamname});
        if (!teamReponses) return res.json({error: "No Responses Found"});
        res.json({teamReponses});
    } catch(err){
        console.log(err)
    }
})

module.exports = router;
