import "../assets/style/q.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/captain.jpg";

const Q12 = () => {
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

    // Check if round is still active (Polling every 5 seconds)
    useEffect(() => {
        if (!teamName) return;

        let isMounted = true; // Track component mount state

        const validateAccess = async () => {
            try {
                // Fetch round status
                const roundResponse = await axios.get("https://dataquest-host.onrender.com/rounds/round-status");
                const { active_round } = roundResponse.data;

                if (!active_round && isMounted) {
                    
                    navigate("/level", { replace: true });
                    return;
                }

                // Fetch team responses
                const response = await fetch("https://dataquest-host.onrender.com/rounds/team-response", {
                    credentials: "include",
                });
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
    question_id: "q12",
    submission_time: submissionTime,  // ✅ Now in "HH:MM:SS" format
    answer,
});

            if (response.data.success) {
                navigate("/q13");
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
                        <h2>Problem 2</h2>
                        <p>
                        Your skills have helped us uncover valuable information, but the battle isn’t over yet! We must now assist our mighty allies, the Green Monster (Hulk) and Thor, who are trapped in the middle of an advancing enemy army. The enemies are approaching from **both the left and right sides, preparing for a fierce battle.
Hulk, known for his raw strength and unstoppable rage, is ready to smash his way through the enemy ranks. However, he must make a strategic decision—which side should he attack? To maximize his impact, Hulk decides to charge toward the side with the greatest enemy power and neutralize the strongest threat first.
Your challenge is to analyze the given data, determine the power levels of the enemy forces on each side, and help Hulk choose the most critical target.
Use your analytical skills, compare the data effectively, and guide Hulk toward the most dangerous side! The fate of this battle depends on your decision.
if its above them it is  left if its below them it is right.
                        </p>
                        <h3>Data: <a href="/data12.csv" download="data.csv">click here</a></h3>
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

export default Q12;
