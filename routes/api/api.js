const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const superAdminMiddleware = require("../../middleware/superAdmin.middleware");

const usersRouter = require("./users");
const animalsRouter = require("./animals");
const authRouter = require("./auth");
const productsRouter = require("./products");

// http://localhost:3001/api/
router.get("/", authMiddleware, superAdminMiddleware, (req, res) => {
  console.log(req.userData);
  res.json({ msg: "hello!" });
});
// // http://localhost:3001/api/animals
// router.get("/animals", (req, res) => {
//   res.json(["dog", "unicorn", "dragon", "bigfoot", "rahno"]);
// });

//http://localhost:3001/api/users
router.use("/users", usersRouter);

//http://localhost:3001/api/animals
router.use("/animals", animalsRouter);

//http://localhost:3001/api/auth
router.use("/auth", authRouter);

//http://localhost:3001/api/products
router.use("/products", productsRouter);

module.exports = router;
