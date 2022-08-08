const express = require("express");
const router = express.Router();
const usersModule = require("../../models/users.model");
const usersValidation = require("../../validation/users.validation");
const bcrypt = require("../../config/bcrypt");
const CustomResponse = require("../../classes/CustomResponse");
const jwt = require("../../config/jwt");
const generateRandomAlphaNumString = require("../../util/randomAlphaNum");
const sendEmail = require("../../config/mailer");

router.post("/signup", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateSignupSchema(req.body);
    console.log("validatedValue", validatedValue);
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length > 0) {
      // throw { status: "failed", msg: "email already exist" };
      // throw new CustomResponse("failed", "email already exist");
      throw new CustomResponse(
        CustomResponse.STATUSES.fail,
        "email already exist"
      );
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
    res.json(
      new CustomResponse(CustomResponse.STATUSES.success, "user created")
    );
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
      // throw { status: "failed", msg: "invalid email or password" };
      throw new CustomResponse(
        CustomResponse.STATUSES.fail,
        "invalid email and/or password"
      );
    }
    const hashRes = await bcrypt.cmpHash(
      validatedValue.password,
      usersData[0].password
    );
    if (!hashRes) {
      // throw { status: "failed", msg: "invalid email or password" };
      throw new CustomResponse(
        CustomResponse.STATUSES.fail,
        "invalid email and/or password"
      );
    }
    let token = await jwt.generateToken({ email: usersData[0].email });
    res.json(new CustomResponse(CustomResponse.STATUSES.success, token));
  } catch (err) {
    res.json(err);
  }
});

router.post("/forgetpassword", async (req, res) => {
  try {
    const validatedValue = await usersValidation.validateForgetPasswordSchema(
      req.body
    );
    const usersData = await usersModule.selectUserByEmail(validatedValue.email);
    if (usersData.length <= 0) {
      // throw { status: "failed", msg: "invalid email or password" };
      throw new CustomResponse(
        CustomResponse.STATUSES.success,
        "if the email exists, the mail was sent"
      );
    }
    const secretKey = generateRandomAlphaNumString(4);
    // const urlSecretKey = `http://localhost:${process.env.PORT}/api/recoverpassword/${secretKey}`;
    const urlSecretKey = `http://localhost:3000/${secretKey}`;
    //30 min * 60 sec * 1000 ms = 1800000 ms
    const expDate = new Date(Date.now() + 1800000);
    await usersModule.updateRecovery(validatedValue.email, secretKey, expDate);
    sendEmail({
      from: process.env.EMAIL_EMAIL,
      to: validatedValue.email,
      subject: "🦄your recovery email🦄",
      html: `
        <h1>your recovery link</h1>
        <a href="${urlSecretKey}">here</a>
      `,
    });
    res.json(
      new CustomResponse(
        CustomResponse.STATUSES.success,
        "if the email exists, the mail was sent"
      )
    );
  } catch (err) {
    res.json(err);
  }
});

router.get("/recoverpassword/:secretKey", (req, res) => {});
router.post("/recoverpassword/:secretKey", (req, res) => {});

module.exports = router;
