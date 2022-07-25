const express = require("express");
const router = express.Router();

// http://localhost:3001/api/
router.get("/", (req, res) => {
  res.json({ msg: "hello!" });
});
// http://localhost:3001/api/animals
router.get("/animals", (req, res) => {
  res.json(["dog", "unicorn", "dragon", "bigfoot", "rahno"]);
});

module.exports = router;
