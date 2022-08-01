const express = require("express");
const router = express.Router();
const usersModule = require("../../models/users.model");
const usersValidation = require("../../validation/users.validation");
const bcrypt = require("../../config/bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateSignupSchema(req.body);
    console.log("validatedValue", validatedValue);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length > 0) {
      throw { status: "failed", msg: "email already exist" };
    }
    const hashedPassword = await bcrypt.createHash(validatedValue.password);
    const newUserData = await usersModule.insertUser(
      validatedValue.firstname,
      validatedValue.lastname,
      validatedValue.email,
      hashedPassword,
      validatedValue.phone
    );
    res.json({ status: "ok", msg: "user created" });
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
