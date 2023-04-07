const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Account successfully registered", user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Email Taken" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "1h",
    });
    console.log(token); // log the token for testing
    return res.status(201).json({ message: "User Logged In", token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, name, goal } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { image, name, goal },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update user" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id received: " + id);
  try {
    const user = await User.findOne({ _id: id });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
