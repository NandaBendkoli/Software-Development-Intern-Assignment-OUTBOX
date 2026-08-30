import env from "dotenv";
import app from "./app.js";

env.config();

import "./worker/email.worker.js";

const port = Number(process.env.PORT) || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
