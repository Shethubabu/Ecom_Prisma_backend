import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",  
    "http://localhost:3000"
  ]
}) );
app.use(express.json());
app.use("/api", router);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running in port",process.env.PORT);
});