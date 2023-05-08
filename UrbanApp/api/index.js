const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv/config");
const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const sessionRoutes = require("./routes/sessions");
const mongoose = require("mongoose");

//cors
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//routes
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

//mongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "urban",
  })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => {
    console.log("Error connecting to mongoDB", err);
  });

//test
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server started on port 3000");
});
