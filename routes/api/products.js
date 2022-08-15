const express = require("express");
const router = express.Router();
// const multer = require("multer");
// const uploadMulter = multer({ dest: "uploads/" });
const uploadMulter = require("../../config/multer");
const productsModel = require("../../models/products.model");
const productsValidation = require("../../validation/products.validation");
const authMiddleware = require("../../middleware/auth.middleware");
// const superAdminMiddleware = require("../../middleware/superAdmin.middleware");
const sellerMiddleware = require("../../middleware/seller.middleware");
const CustomResponse = require("../../classes/CustomResponse");

router.get("/", async (req, res) => {
  try {
    const products = await productsModel.selectAllProducts();
    res.json(products);
  } catch (err) {
    res.status(401).json(err);
  }
});

// router.post(
//   "/",
//   authMiddleware,
//   sellerMiddleware,
//   uploadMulter.single("prudImg"),
//   async (req, res) => {
//     try {
//       console.log(req.file);
//       const validatedValue = await productsValidation.validateNewProductSchema(
//         req.body
//       );
//       await productsModel.insertProduct(
//         validatedValue.name,
//         validatedValue.price,
//         validatedValue.description,
//         validatedValue.stock,
//         req.userData._id
//       );
//       res.json(
//         new CustomResponse(CustomResponse.STATUSES.success, "new product added")
//       );
//     } catch (err) {
//       res.status(401).json(err);
//     }
//   }
// );
router.post("/", uploadMulter.single("prudImg"), async (req, res) => {
  try {
    console.log(req.file);
    const validatedValue = await productsValidation.validateNewProductSchema(
      req.body
    );
    await productsModel.insertProduct(
      validatedValue.name,
      validatedValue.price,
      validatedValue.description,
      validatedValue.stock,
      req.file.filename,
      "62f39f551f94db9e3ef5137f"
    );
    res.json(
      new CustomResponse(CustomResponse.STATUSES.success, "new product added")
    );
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
