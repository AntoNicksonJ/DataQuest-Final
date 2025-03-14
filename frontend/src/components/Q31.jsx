import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from '../assets/thanos.jpg'

const Q31 = () => {
    const [answer, setAnswer] = useState("");
    const [teamName, setTeamName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch team name on component mount
    useEffect(() => {
        const fetchTeamName = async () => {
            try {
                const response = await axios.get("https://dataquest-host.onrender.com/users/session");
                setTeamName(response.data.teamname);
            } catch (err) {
                console.error("Error fetching team name:", err);
                setError("Could not fetch team name. Try refreshing.");
            }
        };

        fetchTeamName();
    }, []);

    useEffect(() => {
        const checkRoundStatus = async () => {
            try {
                const response = await axios.get("https://dataquest-host.onrender.com/rounds/round-status");
                const { active_round } = response.data;

                if (!active_round || active_round !== 3) {
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
    question_id: "q31",
    submission_time: submissionTime,  // ✅ Now in "HH:MM:SS" format
    answer,
});

        

            if (response.data.success) {
                navigate("/level"); // Navigating to the final level
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
            <div id="grid" style={{ gridTemplateColumns: "100%" }}>
                <div id="flex">
                    <h1 id="title">ROUND 3</h1>
                    <div id="question">
                        <h2>Problem 1</h2>
                        <p>
                        "NOW! We Are in the Endgame."
                        The universe stands on the edge of annihilation. After countless battles, unimaginable sacrifices, and one desperate chance, the Avengers have done the impossible—they’ve brought back every fallen hero. But Thanos is still out there, stronger than ever, and this is the last stand. This is the Endgame.
                        Victory isn’t just about strength; it’s about precision, about finding the perfect strategy to counter Thanos. Every battle that came before has given us something valuable—data. Every clash, every hero’s performance, every synergy and failure has been recorded. And now, with the fate of the universe at stake, it’s time to use that knowledge.
                        A dataset has been compiled, holding the details of every possible combination of heroes, their power levels, their effectiveness in battle, and their probability of success against the Mad Titan. This is where the real fight begins—not on the battlefield, but in the data. A model must be trained, one that can predict the best possible team formations, one that can analyze the numbers and reveal the winning strategy.
                        The Avengers are looking to you. Your task is to build this predictive model, to uncover the combinations that give them the highest chance of victory. Every second counts, every choice matters. Train the model, run the simulations, and determine the team that will bring Thanos to his knees.
                        There is no second chance. No rewinds. This is the Endgame. And we must win.
                        </p>
                        <h3>Data: <a href="/data31.csv" download="data.csv">click here</a></h3>
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

export default Q31;
