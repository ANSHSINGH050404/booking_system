import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.route"
import movieRouter from "./src/routes/movie.route"
import showRouter from "./src/routes/show.route"
import theaterRouter from "./src/routes/theater"
import screenRouter from "./src/routes/screen"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/auth",authRouter)
app.use("/movie",movieRouter)
app.use("/show",showRouter)
app.use("/theater",theaterRouter)
app.use("/screen",screenRouter)

app.get("/", (_req, res) => {
  res.json({ message: " backend API" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
