const express = require("express");
const router = express.Router();
const usersModule = require("../../models/users.model");
const usersValidation = require("../../validation/users.validation");
const bcrypt = require("../../config/bcrypt");
const CustomResponse = require("../../classes/CustomResponse");

router.post("/signup", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateSignupSchema(req.body);
    console.log("validatedValue", validatedValue);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length > 0) {
      // throw { status: "failed", msg: "email already exist" };
      throw new CustomResponse("failed", "email already exist");
    }
    const hashedPassword = await bcrypt.createHash(validatedValue.password);
    const newUserData = await usersModule.insertUser(
      validatedValue.firstname,
      validatedValue.lastname,
      validatedValue.email,
      hashedPassword,
      validatedValue.phone
    );
    // res.json({ status: "ok", msg: "user created" });
    res.json(new CustomResponse("ok", "user created"));
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

router.post("/login", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateLoginSchema(req.body);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length <= 0) {
      throw { status: "failed", msg: "invalid email or password" };
    }
    const hashRes = await bcrypt.cmpHash(
      validatedValue.password,
      usersData[0].password
    );
    if (!hashRes) {
      throw { status: "failed", msg: "invalid email or password" };
    }
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
