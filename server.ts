import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db.js";

dotenv.config();

const PORT = process.env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running at  http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("error occured ", err);
  });
