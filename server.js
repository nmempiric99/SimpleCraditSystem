const express = require("express");
const connection = require("./config/config");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/userRoutes");

// Routes
app.use('/api/users', userRoutes);


app.listen(process.env.PORT, () => {
  console.log("Server started on port", process.env.PORT);
});
