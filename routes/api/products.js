const express = require("express");
const router = express.Router();
const productsModel = require("../../models/products.model");

router.get("/", async (req, res) => {
  try {
    const products = await productsModel.selectAllProducts();
    res.json(products);
  } catch (err) {
    res.status(401).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const products = await productsModel.selectAllProducts();
    res.json(products);
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
