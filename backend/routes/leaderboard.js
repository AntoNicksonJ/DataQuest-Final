const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const TeamResponse = require("../models/TeamResponse"); // Ensure correct model import

// 📌 Round-wise Leaderboard API
router.get("/leaderboard/:roundNumber", async (req, res) => {
  try {
    const roundNumber = parseInt(req.params.roundNumber); // Get round number from request params

    // Fetch all team responses for the given round
    const teamResponses = await TeamResponse.find({
      round_number: roundNumber,
    });

    // Process leaderboard data
    const leaderboard = teamResponses.map((team) => {
      const totalCorrectAnswers = team.responses.length; // Number of questions answered correctly

      // Calculate total time spent in seconds
      const totalTimeSpent = team.responses.reduce((total, response) => {
        const timeParts = response.time_spent.split(":").map(Number);

        if (timeParts.some(isNaN)) return total; // Ignore invalid entries

        let seconds = 0;
        if (timeParts.length === 3) {
          // HH:MM:SS format
          const [hours, minutes, secs] = timeParts;
          seconds = hours * 3600 + minutes * 60 + secs;
        } else if (timeParts.length === 2) {
          // MM:SS format
          const [minutes, secs] = timeParts;
          seconds = minutes * 60 + secs;
        }

        return total + seconds;
      }, 0);

      return {
        team_name: team.team_name,
        totalCorrectAnswers,
        totalTimeSpent, // Now properly calculated in seconds
      };
    });

    // Sort leaderboard by most correct answers, then least time spent
    leaderboard.sort((a, b) => {
      if (b.totalCorrectAnswers !== a.totalCorrectAnswers) {
        return b.totalCorrectAnswers - a.totalCorrectAnswers;
      }
      return a.totalTimeSpent - b.totalTimeSpent;
    });

    res.json({ success: true, leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching leaderboard" });
  }
});

module.exports = router;
