import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/style/admin.css";

const API_BASE_URL = "https://dataquest-host.onrender.com"; // Adjust according to your backend

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [progress, setProgress] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeRound, setActiveRound] = useState(null);

  // Fetch registered teams
  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/users`);
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  // Fetch progress round-wise
  const fetchProgress = async (roundNumber) => {
    try {
      const teamsResponse = await axios.get(`${API_BASE_URL}/users/users`);
      const progressResponse = await axios.get(
        `${API_BASE_URL}/progress/progress-tracking/${roundNumber}`
      );

      const teams = teamsResponse.data;
      const progressData = progressResponse.data.data;

      const progressMap = {};
      progressData.forEach((team) => {
        progressMap[team.team_name] = team;
      });

      const mergedProgress = teams.map((team) => {
        const teamProgress = progressMap[team.teamname] || {};
        return {
          team_name: team.teamname,
          roundNumber,
          Q1: teamProgress.Q1 || "❌",
          Q2: teamProgress.Q2 || "❌",
          Q3: teamProgress.Q3 || "❌",
          Q4: teamProgress.Q4 || "❌",
          Q5: teamProgress.Q5 || "❌",
          Q6: teamProgress.Q6 || "❌",
          Q7: teamProgress.Q7 || "❌",
          Q1_time: teamProgress.Q1_time || "--",
          Q4_time: teamProgress.Q4_time || "--",
          Q7_time: teamProgress.Q7_time || "--",
        };
      });

      setProgress(mergedProgress);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // Fetch leaderboard round-wise
  const fetchLeaderboard = async (roundNumber) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/leaderboard/leaderboard/${roundNumber}`
      );
  
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Fetch round status
  const fetchRoundStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rounds/round-status`);
      setActiveRound(response.data.active_round);
    } catch (error) {
      console.error("Error fetching round status:", error);
    }
  };

  // Start a round
  const startRound = async (roundId) => {
    try {
      await axios.post(`${API_BASE_URL}/rounds/start-round/${roundId}`);
      setActiveRound(roundId);
      fetchProgress(roundId);
      fetchLeaderboard(roundId);
    } catch (error) {
      console.error("Error starting round:", error);
    }
  };

  // End the round
  const endRound = async () => {
    try {
      await axios.post(`${API_BASE_URL}/rounds/end-round`);
      setActiveRound(null);
    } catch (error) {
      console.error("Error ending round:", error);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      fetchTeams();
      fetchRoundStatus();
      if (activeRound) {
        fetchProgress(activeRound);
        fetchLeaderboard(activeRound);
      }
    };
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000); // Refresh every 30 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [activeRound]);
  
  

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>

      {/* Team Management */}
      <section className="admin-team-management">
        <h2>Team Management</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Team Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team._id}>
                <td>{team._id}</td>
                <td>{team.teamname}</td>
                <td>{team.email}</td>
                <td>{team.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Progress Tracking */}
      {/* Progress Tracking */}
      <section className="admin-progress-tracking">
        <h2>Progress Tracking (Round {activeRound || "None"})</h2>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              {activeRound === 1 && (
                <>
                  <th>Q1</th>
                  <th>Q2</th>
                  <th>Q3</th>
                </>
              )}
              {activeRound === 2 && (
                <>
                  <th>Q4</th>
                  <th>Q5</th>
                  <th>Q6</th>
                </>
              )}
              {activeRound === 3 && <th>Q7</th>}
            </tr>
          </thead>
          <tbody>
            {progress.map((teamProgress, index) => (
              <tr key={index}>
                <td>{teamProgress.team_name}</td>
                {activeRound === 1 && (
                  <>
                    <td>{teamProgress.Q1 || "❌"}</td>
                    <td>{teamProgress.Q2 || "❌"}</td>
                    <td>{teamProgress.Q3 || "❌"}</td>
                  </>
                )}
                {activeRound === 2 && (
                  <>
                    <td>{teamProgress.Q4 || "❌"}</td>
                    <td>{teamProgress.Q5 || "❌"}</td>
                    <td>{teamProgress.Q6 || "❌"}</td>
                  </>
                )}
                {activeRound === 3 && <td>{teamProgress.Q7 || "❌"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Leaderboard - Round Wise */}
      <section className="admin-leaderboard">
        <h2>Leaderboard (Round {activeRound || "None"})</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Correct Answers</th>
              <th>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((team, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{team.team_name}</td>
                <td>{team.totalCorrectAnswers}</td>
                <td>{team.totalTimeSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Level Control */}
      <section className="admin-level-control">
        <h2>Round Control</h2>
        <div className="admin-round-control">
          <h3>
            Current Active Round:{" "}
            {activeRound ? `Round ${activeRound}` : "None"}
          </h3>

          {[1, 2, 3].map((round) => (
            <button
              key={round}
              className={
                activeRound === round ? "admin-disable" : "admin-enable"
              }
              onClick={() => startRound(round)}
              disabled={activeRound === round}
            >
              Start Round {round}
            </button>
          ))}

          <button
            className="admin-disable"
            onClick={endRound}
            disabled={!activeRound}
          >
            End Current Round
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
