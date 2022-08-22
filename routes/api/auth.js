const express = require("express");
const router = express.Router();
const logger = require("../../config/winston");
const usersModule = require("../../models/users.model");
const usersValidation = require("../../validation/users.validation");
const bcrypt = require("../../config/bcrypt");
const CustomResponse = require("../../classes/CustomResponse");
const jwt = require("../../config/jwt");
const generateRandomAlphaNumString = require("../../util/randomAlphaNum");
const sendEmail = require("../../config/mailer");
const crypto = require("../../config/crypto");

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
      logger.error(`cant find this email:${validatedValue.email}`);
      throw new CustomResponse(
        CustomResponse.STATUSES.success,
        "if the email exists, the mail was sent"
      );
    }
    const secretKey = generateRandomAlphaNumString(8);
    const encryptedData = crypto.encrypt(validatedValue.email);
    // const urlSecretKey = `http://localhost:${process.env.PORT}/api/recoverpassword/${secretKey}`;
    // const urlSecretKey = `http://localhost:3000/recoverpassword/${secretKey}/${validatedValue.email}`;
    const urlSecretKey = `http://localhost:3000/recoverpassword/${secretKey}/${encryptedData.iv}/${encryptedData.encryptedData}`;
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
    logger.info(`mail sent to: ${validatedValue.email}`);
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

router.post(
  "/recoverpassword/:secretKey/:iv/:encryptedData",
  async (req, res) => {
    try {
      const validatedValue =
        await usersValidation.validateRecoveryPasswordSchema(req.body);
      /*
        get data from params
        decrypt the data from params
        if it success then we will get email
        else we will get ^&*%$&^%
      */
      const decryptedEmail = crypto.decrypt({
        iv: req.params.iv,
        encryptedData: req.params.encryptedData,
      });
      /*
        check if it success or fail
      */
      const validateEmail =
        await usersValidation.validateRecoveryPasswordValidateEmailSchema({
          email: decryptedEmail,
        });
      const usersData = await usersModule.selectUserByEmail(
        validateEmail.email
      );
      if (usersData.length <= 0) {
        // throw { status: "failed", msg: "invalid email or password" };
        logger.error(`email not exists, ${validatedValue.email}`);
        throw new CustomResponse(
          CustomResponse.STATUSES.fail,
          "something went wrong"
        );
      }
      if (usersData[0].recovery.secretKey !== req.params.secretKey) {
        logger.error(
          `user with email ${validatedValue.email} provied wrong key:${req.params.secretKey}`
        );
        throw new CustomResponse(
          CustomResponse.STATUSES.fail,
          "something went wrong"
        );
      }
      const nowDT = new Date();
      /*
        get the date and time now and convert it to number
        get the exp date from database and convert it to number
        if the number from the db smaller then now then the revocery expired
      */
      if (nowDT.getTime() > usersData[0].recovery.dateRecovery.getTime()) {
        logger.error(`${validatedValue.email} recovery key exipered`);
        throw new CustomResponse(
          CustomResponse.STATUSES.fail,
          "something went wrong"
        );
      }
      const hashedPassword = await bcrypt.createHash(validatedValue.password);
      await usersModule.updatePassword(validateEmail.email, hashedPassword);
      res.json(
        new CustomResponse(CustomResponse.STATUSES.success, "password updated")
      );
    } catch (err) {
      res.json(err);
    }
  }
);

module.exports = router;
