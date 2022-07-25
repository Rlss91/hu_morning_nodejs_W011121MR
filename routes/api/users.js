const express = require("express");
const router = express.Router();

// http://localhost:3001/api/users/getuser
router.get("/getuser", (req, res) => {
  let user = {
    name: "kenny",
    lname: "mc",
    age: 8,
  };
  res.json(user);
});
// http://localhost:3001/api/users/getallusers
router.get("/getallusers", (req, res) => {
  res.json(dataArr);
});

let dataArr = [];
// http://localhost:3001/api/users/addnewuser
router.post("/addnewuser", (req, res) => {
  console.log(req.body);
  dataArr = [...dataArr, req.body];
  res.json({ msg: "ok" });
});

module.exports = router;
