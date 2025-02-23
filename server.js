require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const { initWebSocket } = require("./websocket/socket");
const {
  extractKeyphrases,
  categorizeText,
  highlightText,
} = require("./routes/keyphrases"); // Importing the functions

const app = express();
const server = http.createServer(app);

connectDB();
initWebSocket(server);

app.use(cors());
app.use(express.json());

// Route for keyphrase extraction
app.post("/keyphrases", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    // Extract keyphrases
    const keyphrases = await extractKeyphrases(text);

    // Categorize extracted keyphrases
    const categories = categorizeText(keyphrases);

    // Highlight keyphrases in the original text
    const highlightedText = highlightText(text, keyphrases);

    return res.json({
      keyphrases,
      categories,
      highlightedText,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error extracting keyphrases", error: error.message });
  }
});

// Routes for other API endpoints
app.use("/api/auth", require("./routes/authroutes"));
// app.use("/api/taches", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
