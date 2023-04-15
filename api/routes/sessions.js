const express = require("express");
const router = express.Router();
const Session = require("../models/session");

// post requests for saving sessions
// executes when stop is pressed
router.post("/", async (req, res) => {
  try {
    const { id, distance, timing, coordinates, isCycle, title } = req.body;
    const session = new Session({
      id,
      distance,
      timing,
      coordinates,
      isCycle,
      title,
    });
    const savedSession = await session.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// get request for session history page
// executes when user enters the session page
router.get("/", async (req, res) => {
  const { id } = req.params;
  console.log("id received: " + id);
  try {
    res.json(await Session.find({ id: id }));
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// get request for the session view page
// executes when user enters a session view from the session page
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.json(await Session.find({ id: id }));
});

module.exports = router;
