import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { testDB } from "./config/db-test";
import { env } from "./config/env";

const PORT = env.PORT;

testDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});
