import express from "express";
import { connectClient } from "./config/mongodb_config.js";
import { authRoute, dashboardRoute, passwordRoute } from "./routes/index.js";
import { fetchYoutubeDiscussions } from "./controllers/index.js";
import { fetchUserStats } from "./controllers/ProfileStatsController.js";
import { updateUserHandle } from "./controllers/updateuserhandleController.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { protect } from "./middleware/protect.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

async function startServer() {
  try {
    await connectClient();

    app.use("/", authRoute);
    app.use("/password", protect, passwordRoute);
    app.use("/dashboard", protect, dashboardRoute);
    app.get("/userstats/:userId", protect, fetchUserStats);
    app.get("/past-contests", protect, fetchYoutubeDiscussions);
    app.patch("/:userId/handle", protect, updateUserHandle);

    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
}
startServer();
