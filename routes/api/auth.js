const express = require("express");
const router = express.Router();
const usersModule = require("../../models/users.model");

router.post("/signup", async (req, res) => {
  try {
    const user = await usersModule.insertUser(
      "kenny",
      "mc",
      "kenny@gmail.com",
      "123",
      "050"
    );
    console.log("user", user);
  } catch (err) {}
});

module.exports = router;
