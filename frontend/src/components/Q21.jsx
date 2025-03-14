import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/thanos.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Q21 = () => {
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

        if ((!active_round || active_round !== 2) && isMounted) {

          navigate("/level", { replace: true });
          return;
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
          question_id: "q21",
          submission_time: submissionTime,  // ✅ Now in "HH:MM:SS" format
          answer,
      });



      if (response.data.success) {
        navigate("/q22"); // Navigate to next question if correct
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

  return (
    <div className="q" style={{ backgroundImage: `url(${bg})` }}>
      <Navbar />
      <div id="grid">
        <div id="flex">
          <h1 id="title">ROUND 2</h1>
          <div id="question">
            <h2>Problem 1</h2>
            <p>
            Urgent Mission: Wakanda Under Siege!
            Wakanda’s defense system has encountered a critical failure! The enemy positioning system has malfunctioned and is now generating randomized columns of numbers, making it nearly impossible to track the incoming enemy forces.
            However, there is a hidden pattern within this chaotic data! Our intelligence team has discovered that each column contains a special type of number—a number that has no factors other than 1 and itself.
            Analyse the dataset and give the index of special number in column wise order
            </p>
            <h3>
            <h3>Data: <a href="/data21.csv" download="data.csv">click here</a></h3>
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

export default Q21;
