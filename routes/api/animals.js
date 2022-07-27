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
router.patch("/", (req, res) => {
  let animal = animalsArr.find((item) => item._id === req.body._id);
  if (animal) {
    animal.name = req.body.name;
    res.json({ msg: "ok" });
  } else {
    res.json({ msg: "not ok" });
  }
});
router.delete("/", (req, res) => {
  animalsArr = animalsArr.filter((item) => item._id !== req.body._id);
  res.json({ msg: "ok" });
});

module.exports = router;
