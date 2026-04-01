import express from "express";
import communityRoutes from "../backend/routes/community/communityRoutes";

const app = express();

app.use(express.json());

// API routes
app.use("/api/community", communityRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Note: We don't call app.listen() here. 
// Vercel handles the execution of the exported app.
export default app;
