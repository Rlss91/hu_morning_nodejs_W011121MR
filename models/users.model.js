const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* create user schema */
const usersSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  recovery: {
    secretKey: { type: String },
    dateRecovery: { type: Date },
  },
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

const updateRecovery = (email, key, date) => {
  return Users.updateOne(
    { email },
    { "recovery.secretKey": key, "recovery.dateRecovery": date }
  );
};

const selectUserByEmail = (email) => {
  return Users.find({ email });
};

module.exports = {
  insertUser,
  selectUserByEmail,
  updateRecovery,
};
