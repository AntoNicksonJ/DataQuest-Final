import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import bg from "../assets/spider.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Q13 = () => {
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
                toast.error("Could not fetch team name. Try refreshing.");
            }
        };

        fetchTeamName();
    }, []);

    // Check if round is still active and poll every 5 seconds
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
            toast.error("Team name is missing. Please try logging in again.");
            setLoading(false);
            return;
        }

        if (!answer.trim()) {
            toast.error("Please enter an answer.");
            setLoading(false);
            return;
        }

        try {
            

            const now = new Date();
const submissionTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

const response = await axios.post("https://dataquest-host.onrender.com/quiz/submit-answer", {
    team_name: teamName,
    question_id: "q13",
    submission_time: submissionTime,  // ✅ Now in "HH:MM:SS" format
    answer,
});

            

            if (response.data.success) {
                toast.success("Successfully submitted! Redirecting...");
                setTimeout(() => navigate("/level", { replace: true }), 2000); // Redirect after 2 seconds
            } else {
                toast.error("Wrong answer! Try again.");
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            toast.error("Wrong answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="q" style={{ backgroundImage: `url(${bg})` }}>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <div id="grid">
                <div id="flex">
                    <h1 id="title">ROUND 1</h1>
                    <div id="question">
                        <h2>Problem 3</h2>
                        <p>
                        Mission Update: Final Stand in New York City!
Heroes, we are at the climax of the battle in New York City. A deadly missile has been launched, and its target is set to destroy the city! Our only hope is Iron Man, who must intercept the missile and divert it into the open portal above before it’s too late.
However, there’s a critical problem! While redirecting the missile, Iron Man is on a collision course with a towering building directly in front of him. To complete his mission successfully, he must adjust his trajectory in such a way that he
Just grazes a single point on the building at (24,159432) without crashing into it 
Iron Man's flight path follows an exponential trajectory, meaning its mathematical representation follows the form of a function like 
2^x or e^x
Your challenge is to analyze the situation, calculate the correct exponential function, and determine the precise path he must take to save New York City!
Use your mathematical and analytical skills to find the right function and inform Iron Man before time runs out! 🚀🔥
Are you ready to take on this high-stakes mission? The fate of the city is in your hands!
                        </p>
                        <h3>Data: <a href="/data13.csv" download="data13.csv">click here</a></h3>
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
                </div>
            </div>
        </div>
    );
};

export default Q13;
