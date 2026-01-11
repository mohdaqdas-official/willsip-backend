if (process.env.RENDER !== "true") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

// middleware Protected API
app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to WillSip Dashboard",
    user: req.user,
  });
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
