const express = require("express");
const router = express.Router();

let animalsArr = [];

router.get("/", (req, res) => {
  res.json(animalsArr);
});
router.post("/", (req, res) => {
  animalsArr = [...animalsArr, req.body];
  res.json({ msg: "ok" });
});

module.exports = router;
