import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style/home.css";
import yukta from "../assets/yuktalogo.png";

function Home() {
    const [teamname, setTeamname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        if (!teamname || !email || !password) {
            setError("All fields are required!");
            return;
        }
    
        try {
            const response = await axios.post("https://dataquest-host.onrender.com/users/register", {
                teamname,
                email,
                password,
            });
    
            
            navigate("/login"); // Navigate to login page after successful registration
        } catch (err) {
            console.error("❌ Registration Error:", err.response?.data?.error || err.message);
            setError(err.response?.data?.error || "Something went wrong");
        }
    };
    

    return (
        <div className="home">
            <nav className="navbar">
                <img src={yukta} alt="Logo" />
            </nav>

            <div id="grid">
                <div id="bottomLeft">
                    <div id="Content">
                        <h1 id="title" className="white">Data Quest, The Ultimate EDA Challenge</h1>
                        <h1 id="subTitle" className="white">
                            Dive into the world of data exploration with our EDA Challenge!
                        </h1>
                    </div>
                </div>

                <div id="bottomRight">
                    <div id="flex">
                        <h2 id="login">Register</h2>

                        {error && <div className="error">{error}</div>}


                        <fieldset className="label">
                            <legend>Team Name</legend>
                            <input
                                type="text"
                                className="input"
                                placeholder="Team Name"
                                value={teamname}
                                onChange={(e) => setTeamname(e.target.value)}
                                required
                            />
                        </fieldset>

                        <fieldset className="label">
                            <legend>Email ID</legend>
                            <input
                                type="email"
                                className="input"
                                placeholder="Email ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </fieldset>

                        <fieldset className="label">
                            <legend>Password</legend>
                            <input
                                type="password"
                                className="input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </fieldset>
                        <div id="register" style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                        <button type="submit" id="submit" onClick={handleSubmit}>
                            Register
                        </button>
                        <Link to="/login" style={{ color: "white"} }>Login Page </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
