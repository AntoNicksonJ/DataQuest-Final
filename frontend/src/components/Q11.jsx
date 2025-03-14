import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import bg from "../assets/ironman.jpg";

const Q11 = () => {
  const [answer, setAnswer] = useState("");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch team name on component mount
  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await axios.get(
          "https://dataquest-host.onrender.com/users/session"
        );
        setTeamName(response.data.teamname);
      } catch (err) {
        console.error("Error fetching team name:", err);
        setError("Could not fetch team name. Try refreshing.");
      }
    };

    fetchTeamName();
  }, []);

  // Check if round is still active
  useEffect(() => {
    const checkRoundStatus = async () => {
      try {
        const response = await axios.get(
          "https://dataquest-host.onrender.com/rounds/round-status"
        );
        const { active_round } = response.data;

        if (!active_round || active_round !== 1) {
          navigate("/level"); // Redirect if round has ended
        }
      } catch (error) {
        console.error("Error fetching round status:", error);
      }
    };

    checkRoundStatus();
    const interval = setInterval(checkRoundStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!teamName) {
      setError("Team name is missing. Please try logging in again.");
      setLoading(false);
      return;
    }

    if (!answer.trim()) {
      setError("Please enter an answer.");
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      const submissionTime = `${String(now.getHours()).padStart(
        2,
        "0"
      )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      const response = await axios.post(
        "https://dataquest-host.onrender.com/quiz/submit-answer",
        {
          team_name: teamName,
          question_id: "q11",
          submission_time: submissionTime, // ✅ Now in "HH:MM:SS" format
          answer,
        }
      );

      if (response.data.success) {
        setTimeout(() => navigate("/q12"), 1000);
      } else {
        setError("Wrong answer! Try again.");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Wrong answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="q" style={{ backgroundImage: `url(${bg})` }}>
      <Navbar />
      <div id="grid">
        <div id="flex">
          <h1 id="title">ROUND 1</h1>
          <div id="question">
            <h2>Problem 1</h2>
            <p>
              We appreciate your courage in stepping up to help us save the
              world. Our scientists have recently intercepted a mysterious
              dataset containing crucial information about an impending arrival.
              The data holds encrypted clues about someone who is coming to
              assist us in this critical mission. Your challenge is to analyze
              the data, uncover hidden patterns, and decode the mystery—Who is
              arriving to aid our cause? Use your data skills, intuition, and
              teamwork to crack the code. The fate of the mission rests in your
              hands! Are you ready to unravel the mystery? Let the quest begin!
            </p>
            <h3>
              Data:{" "}
              <a href="/data11.csv" download="data.csv">
                click here
              </a>
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              id="answer"
              placeholder="Type your answer"
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <button type="submit" id="submit" disabled={loading}>
              {loading ? "Checking..." : "Submit"}
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Q11;
