import env from "dotenv";
import app from "./app.js";
env.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
