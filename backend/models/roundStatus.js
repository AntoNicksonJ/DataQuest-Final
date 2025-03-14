const mongoose = require("mongoose");

const RoundStatusSchema = new mongoose.Schema({
    active_round: Number,
    started_at: String, // Stores start time as HH:mm:ss
    ended_at: String    // Stores end time as HH:mm:ss
});

module.exports = mongoose.model("RoundStatus", RoundStatusSchema);
