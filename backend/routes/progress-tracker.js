const express = require("express");
const router = express.Router();
const User = require("../models/users"); // Users collection
const TeamResponse = require("../models/TeamResponse"); // Team responses collection
//https://dataquest-host.onrender.com
// 📌 Round-wise Progress Tracking API
router.get("/progress-tracking/:roundNumber", async (req, res) => {
    try {
        const roundNumber = parseInt(req.params.roundNumber); // Extract round number
        const allTeams = await User.find({}, "teamname"); // Fetch all registered teams
        const teamResponses = await TeamResponse.find({ round_number: roundNumber }); // Fetch responses for given round

        // Convert responses into a map for quick lookup
        const responseMap = {};
        teamResponses.forEach((teamResponse) => {
            const teamName = teamResponse.team_name;
            if (!responseMap[teamName]) {
                responseMap[teamName] = {};
            }
            teamResponse.responses.forEach((response) => {
                responseMap[teamName][response.question_id] = response.time_spent || "--"; // Store response time
            });
        });

        // Construct progress data
        const progressData = allTeams.map((team) => {
            const teamProgress = responseMap[team.teamname] || {}; // Get team-specific progress or empty object

            return {
                team_name: team.teamname,
                round_number: roundNumber,
                Q1: teamProgress["q11"] ? "✅" : "❌",
                Q2: teamProgress["q12"] ? "✅" : "❌",
                Q3: teamProgress["q13"] ? "✅" : "❌",
                Q4: teamProgress["q21"] ? "✅" : "❌",
                Q5: teamProgress["q22"] ? "✅" : "❌",
                Q6: teamProgress["q23"] ? "✅" : "❌",
                Q7: teamProgress["q31"] ? "✅" : "❌",
                Q1_time: teamProgress["q11"] || "--",
                Q2_time: teamProgress["q12"] || "--",
                Q3_time: teamProgress["q13"] || "--",
                Q4_time: teamProgress["q14"] || "--",
                Q5_time: teamProgress["q15"] || "--",
                Q6_time: teamProgress["q16"] || "--",
                Q7_time: teamProgress["q17"] || "--",
            };
        });

        res.json({ success: true, data: progressData });
    } catch (err) {
        console.error("Error fetching progress data:", err);
        res.status(500).json({ success: false, message: "Error fetching progress data" });
    }
});

module.exports = router;
