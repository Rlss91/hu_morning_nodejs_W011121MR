const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* create user schema */
const usersSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
});

//create collection
//all the munipulation on the documents will be using this object
const Users = mongoose.model("Users", usersSchema);

//this function will create new user
const insertUser = (firstname, lastname, email, password, phone) => {
  const user = new Users({
    firstname,
    lastname,
    email,
    password,
    phone,
  });
  return user.save();
};

module.exports = {
  insertUser,
};
