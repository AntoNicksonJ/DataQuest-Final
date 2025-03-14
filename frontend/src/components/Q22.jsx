import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/ironman.jpg";

const Q22 = () => {
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

  // Helper function to get current time (HH:mm:ss)
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
  };

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
const submissionTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

const response = await axios.post("https://dataquest-host.onrender.com/quiz/submit-answer", {
    team_name: teamName,
    question_id: "q22",
    submission_time: submissionTime,  // ✅ Now in "HH:MM:SS" format
    answer,
});

      

      if (response.data.success) {
        navigate("/q23"); // Navigate to next question if correct
      } else {
        setError("Wrong answer! Try again.");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      if (err.response) {
        console.error("Server response:", err.response.data);
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError("Wrong answer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if round is still active (Polling every 5 seconds)
  useEffect(() => {
    if (!teamName) return;

    let isMounted = true; // Track component mount state

    const validateAccess = async () => {
      try {
        // Fetch round status
        const roundResponse = await axios.get(
          "https://dataquest-host.onrender.com/rounds/round-status"
        );
        const { active_round } = roundResponse.data;

        if (!active_round && isMounted) {
          
          navigate("/level", { replace: true });
          return;
        }

        // Fetch team responses
        const response = await fetch(
          "https://dataquest-host.onrender.com/rounds/team-response",
          {
            credentials: "include",
          }
        );

        
        const data = await response.json();

        if (!data.teamReponses?.responses[0] && isMounted) {
          
          navigate("/q11", { replace: true });
        }
      } catch (error) {
        console.error("Error validating access:", error);
      }
    };

    // Run validation immediately and then every 5 seconds
    validateAccess();
    const intervalId = setInterval(validateAccess, 5000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
      isMounted = false;
    };
  }, [teamName, navigate]);

  return (
    <div className="q" style={{ backgroundImage: `url(${bg})` }}>
      <Navbar />
      <div id="grid">
        <div id="flex">
          <h1 id="title">ROUND 2</h1>
          <div id="question">
            <h2>Problem 2</h2>
            <p>
            "The Price of the Soul Stone"
You and your team have arrived on Vormir, standing before the spectral guardian, Red Skull. His hollow voice echoes through the dark abyss:
"To claim the Soul Stone, one must sacrifice that which they hold most valuable."
In your hands, you hold a dataset—an encrypted relic containing a list of precious artifacts, entities, or memories, each assigned a priority score representing its significance. The stone demands the highest price.
Your task is to analyze the dataset and determine the most valuable entity to sacrifice. Only by offering it to the abyss will you unlock the hidden secret code, derived from an aggregate function on the remaining values. This code, when deciphered, will reveal next opponent's location of thanos.
The fate of your mission—and perhaps the universe itself—rests on your decision. Choose wisely, sacrifice strategically, and unveil the secret that Red Skull guards..
            </p>
            <h3>
            <h3>Data: <a href="/data22.csv" download="data.csv">click here</a></h3>
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

export default Q22;
