const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const path = require("path")
const app = express()
const cors = require("cors")

let User = require("./server/models/user")

const api = require("./server/routes/users")

mongoose.connect("mongodb://localhost:27017/ionic")
mongoose.Promise = global.Promise

app.use(express.static(path.join(__dirname, "public")))

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use(require("express-session")({
  secret: "my little secret",
  resave: false,
  saveUninitialized: false
}))

//PASSPORT
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use("/api", api)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})


const port = 3000
app.listen(port, () => {
  console.log("server listening on port", port)
})



