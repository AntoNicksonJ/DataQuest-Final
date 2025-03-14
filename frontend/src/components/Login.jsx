import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style/home.css";
import yukta from "../assets/yuktalogo.png";

function Login() {
    const [teamname, setTeamname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload on form submit
        setError(""); // Clear previous errors

        try {
            const response = await axios.post(
                "https://dataquest-host.onrender.com/users/login",
                { teamname, password
                 },
                { withCredentials: true } // ✅ Allows session cookies
            );


            const userRole = response.data.role; // Assuming backend sends role in response

            if (userRole === "admin") {
                navigate("/admin"); // Redirect to admin panel
            } else {
                navigate("/level"); // Redirect to user level page
            }
        } catch (err) {
            console.error("❌ Login Error:", err.response?.data?.error || err.message);
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
                        <h2 id="login">Login</h2>

                        {error && <p className="error">{error}</p>}

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

                        <button type="submit" id="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
