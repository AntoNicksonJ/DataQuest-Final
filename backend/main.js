require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // ✅ Import MongoStore

const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const roundRoutes = require("./routes/roundRoutes");
const LeaderboardRoutes = require("./routes/leaderboard"); // ✅ Import LeaderboardRoutes

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware (Ensures Cookies are sent)
app.use(cors({
  origin: "https://67d3b0cfb7cb4f076a79a00f--hilarious-lokum-960004.netlify.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Move session middleware ABOVE routes
app.use(session({
    secret: "your_secret_key", 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // ✅ Store sessions in MongoDB
    cookie: {
        secure: false, // Set to `true` if using HTTPS
        httpOnly: true, 
        sameSite: "lax", 
        maxAge: 24 * 60 * 60 * 1000 // 1-day expiration
    }
}));

// ✅ Routes (AFTER session middleware)
app.use("/users", userRoutes);
app.use("/quiz", quizRoutes);
app.use("/rounds", roundRoutes);
app.use("/leaderboard", LeaderboardRoutes); // ✅ Leaderboard Route
app.use("/progress", require("./routes/progress-tracker")); // ✅ Progress Route


// ✅ Root Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running 🚀" });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
