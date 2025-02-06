const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/user.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Enables JSON body parsing
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.use("/api/users", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
