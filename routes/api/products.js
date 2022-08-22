const fs = require("fs").promises;
const express = require("express");
const router = express.Router();
// const multer = require("multer");
// const uploadMulter = multer({ dest: "uploads/" });
const multer = require("../../config/multerTypes");
const uploadMulter = multer.createMulter("uploads/", 3000000, {
  type: multer.allowedTypes.img,
});
// const uploadCustomeMulter = multer.createMulter("uploads/", 3000000, {
//   type: multer.allowedTypes.custom,
//   customFormats: ["image/jpeg", "image/png"],
// });
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
router.post(
  "/",
  authMiddleware,
  sellerMiddleware,
  uploadMulter.single("prudImg"),
  async (req, res) => {
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
        req.userData._id
      );
      res.json(
        new CustomResponse(CustomResponse.STATUSES.success, "new product added")
      );
    } catch (err) {
      fs.unlink(req.file.path);
      res.status(401).json(err);
    }
  }
);

module.exports = router;
