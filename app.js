require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")

// Import routes
// const authRoutes = require("./routes/auth")
const recipeRoutes = require("./routes/recipes")

const app = express()

// ===== Middleware =====
app.use(express.json())                          // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))  // Parse URL-encoded form data
app.use(cors())                                  // Enable CORS for frontend
app.use(morgan("dev"))                           // Request logging
app.use(helmet())                                // Basic security headers

// ===== Routes =====
app.get("/", (req, res) => {
  res.json({ message: "🍳 Recipe API is running..." })
})

// Example route mounting
// app.use("/api/auth", authRoutes)
app.use("/api/recipes", recipeRoutes)

// ===== Database + Server =====
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
  })
  .catch(err => console.error("❌ DB connection error:", err))

module.exports = app
