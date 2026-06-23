import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { testDB } from "./config/db-test";

const PORT = process.env.PORT || 5000;

testDB();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
