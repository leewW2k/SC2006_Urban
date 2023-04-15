const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// post request for user registration
// executes when user enter valid login details for user registration
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Account successfully registered", user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Email Taken!!!" });
  }
});

// post request for user login
// executes when user tries to login into their account
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email!!!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Password!!!" });
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

// get the user details after the user successfully logins
// displayed on the profile page of Urban
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, name, goal, goalProgress, goalCompleteDate } = req.body;
    const user = await User.findById(id);
    user.image = image;
    user.name = name;
    user.goal = goal;
    user.goalProgress = goalProgress;
    user.goalCompleteDate = goalCompleteDate;

    await user.save();
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update user" });
  }
});

// get the user goal progress
// executes when u need to update after saving session
router.put("/:id/goal-progress", async (req, res) => {
  try {
    const { id } = req.params;
    const { goalProgress } = req.body;
    const user = await User.findById(id);

    user.goalProgress = goalProgress;
    if (user.goalProgress > user.goal && !user.goalCompleteDate) {
      user.goalCompleteDate = Date.now();
    }
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update goal progress" });
  }
});

// resets user goal progres
// executes when user presses the reset page in profile page
router.put("/:id/goal-progress-reset", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    user.goalProgress = 0;
    user.goalCompleteDate = null;
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update goal progress" });
  }
});

// get the userid of the user
// returns userId by finding the id in DB
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
