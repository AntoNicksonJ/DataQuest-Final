import "../assets/style/navbar.css";
import yukta from "../assets/yuktalogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import Axios

axios.defaults.withCredentials = true; // ✅ Ensures cookies are included in requests

function Navbar() {
  const [teamName, setTeamName] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamName();
  }, []);

  const fetchTeamName = async () => {
    try {
      const response = await axios.get("https://dataquest-host.onrender.com/users/session", {
        withCredentials: true,
      }); // ✅ Axios GET request
    

      if (response.data.teamname) {
        setTeamName(response.data.teamname);
      } else {
        setTeamName("Not logged in");
      }
    } catch (error) {
      console.error(
        "Error fetching team name:",
        error.response?.data || error.message
      );
      setTeamName("Error loading team");
    }
  };

  const handleLogout = async () => {
    try {


      const response = await axios.post("https://dataquest-host.onrender.com/users/logout"); // Axios POST request


      if (response.data.success) {

        document.cookie =
          "connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        window.location.href = "/login";
      } else {
        console.error("❌ Logout failed:", response.data.error);
      }
    } catch (error) {
      console.error(
        "❌ Error logging out:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="navbar">
      <nav className="navbar1">
        <img src={yukta} alt="Logo" />
        <div id="TeamLogout">
          <h4 id="TeamName">{teamName}</h4>
          <div onClick={handleLogout} id="Logout" style={{ cursor: "pointer" }}>
            <h4>Log out</h4>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar; 