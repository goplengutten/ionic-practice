const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  password: String
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("user", UserSchema)