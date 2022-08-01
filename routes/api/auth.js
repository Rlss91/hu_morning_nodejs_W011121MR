const express = require("express");
const router = express.Router();
const usersModule = require("../../models/users.model");
const usersValidation = require("../../validation/users.validation");

router.post("/signup", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateSignupSchema(req.body);
    console.log("validatedValue", validatedValue);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length > 0) {
      throw { status: "failed", msg: "email already exist" };
    }
    res.json(usersData);
  } catch (err) {
    console.log("err", err);
    res.json(err);
  }
});
// router.post("/signup", async (req, res) => {
//   try {
//     const user = await usersModule.insertUser(
//       "kenny",
//       "mc",
//       "kenny@gmail.com",
//       "123",
//       "050"
//     );
//     console.log("user", user);
//   } catch (err) {}
// });

module.exports = router;
