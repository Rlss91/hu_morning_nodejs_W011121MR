const express = require("express");
const router = express.Router();

let animalsArr = [
  {
    _id: 1,
    name: "dog",
    age: 5,
  },
  {
    _id: 2,
    name: "unicorn",
    age: 500,
  },
  {
    _id: 3,
    name: "hiydra",
    age: 863,
  },
  {
    _id: 4,
    name: "iguana",
    age: 20,
  },
  {
    _id: 5,
    name: "cat",
    age: 1,
  },
];

router.get("/", (req, res) => {
  res.json(animalsArr);
});

router.get("/getanimalbyid", (req, res) => {
  console.log(req.query);
  let animal = animalsArr.find((item) => item._id == req.query._id);
  if (animal) {
    res.json(animal);
  } else {
    res.json({ msg: "did not found" });
  }
});

router.get("/getanimalsbiggerthen8", (req, res) => {
  let selectedAnimalsArr = animalsArr.filter(
    (item) => item.age > req.query.age
  );
  res.json(selectedAnimalsArr);
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
// router.delete("/", (req, res) => {
//   animalsArr = animalsArr.filter((item) => item._id !== req.body._id);
//   res.json({ msg: "ok" });
// });
router.delete("/:_id", (req, res) => {
  console.log(req.params);
  animalsArr = animalsArr.filter((item) => item._id != req.params._id);
  res.json({ msg: "ok" });
});

module.exports = router;
