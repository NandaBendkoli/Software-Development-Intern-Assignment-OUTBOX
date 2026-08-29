import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  //   res.send("Welocme");
  res.status(200).json({
    success: true,
    message: "App is Running",
  });
});

export default app;