const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res) => {
  const { userid, username, email, password } = req.body;

  try {
    const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

    // Auto role logic
    const role = email === "628443akdas@gmail.com" ? "admin" : "employee";

    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (userid, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [userid || "UID" + Date.now(), username, email, hash, role],
      (err) => {
        if (err) {
          console.log("MYSQL ERROR:", err);
          return res.status(400).json({ message: err.sqlMessage });
        }

        res.json({
          message: "Signup Successful",
          role,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      const token = jwt.sign({ userid: user.userid, role: user.role }, SECRET, {
        expiresIn: "1d",
      });

      res.json({
        token,
        role: user.role,
      });
    }
  );
});

module.exports = router;
