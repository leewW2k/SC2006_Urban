const express = require("express");
const router = express.Router();
const Session = require("../models/session");

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

router.delete("/", async (req, res) => {
  try {
    await Session.deleteMany();
    res.status(200).json({ message: "All sessions deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.json(await Session.find({ id: id }));
});

module.exports = router;
