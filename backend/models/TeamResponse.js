const mongoose = require("mongoose");

const TeamResponseSchema = new mongoose.Schema({
    team_name: { type: String, required: true },
    round_number: { type: Number, required: true },
    responses: [
        {
            question_id: String,
            time_spent: String, // Time taken to answer the question (MM:ss)
            correct: Boolean    // Stores if the answer was correct
        }
    ]
});

const TeamResponse = mongoose.models.TeamResponse || mongoose.model("TeamResponse", TeamResponseSchema);

module.exports = TeamResponse;



