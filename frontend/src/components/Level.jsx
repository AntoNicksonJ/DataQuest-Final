import "../assets/style/level.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

function Level() {
  const [teamName, setTeamName] = useState(null);
  const [activeRound, setActiveRound] = useState(null); // 🔥 Store active round
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamName();

    // 🔄 Fetch active round initially & every 5 seconds
    const interval = setInterval(fetchActiveRound, 5000);
    fetchActiveRound(); // Fetch immediately on mount

    return () => clearInterval(interval); // ✅ Cleanup on unmount
  }, []);

  const fetchTeamName = async () => {
    try {
      const response = await axios.get("https://dataquest-host.onrender.com/users/session", {
        withCredentials: true,
      });

      setTeamName(response.data.teamname);
    } catch (error) {
      console.error("Session Check Failed:", error.response?.data || error);
      setTeamName(null);
      navigate("/"); // 🔄 Redirect to login if session is missing
    }
  };

  const fetchActiveRound = async () => {
    try {
      const response = await axios.get("https://dataquest-host.onrender.com/rounds/round-status");
      setActiveRound(response.data.active_round); // 🔥 Set active round
    } catch (error) {
      console.error("Error fetching active round:", error);
      setActiveRound(null);
    }
  };

  return (
    <div className="level">
      <Navbar /> {/* ✅ Navbar added here */}
      <h1 id="title">
        <span id="white">Data Quest</span>
      </h1>
      <div id="flex">
        {[1, 2, 3].map((round) => (
          <div className="rounds" key={round}>
            Round {round}
            <Link to={activeRound === round ? `/q${round}1` : "#"}>
              <button className="start" disabled={activeRound !== round}>
                {activeRound === round ? "Start" : "Locked"}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Level;
