const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")

router.post("/register", (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      return res.json({ success: false, message: "failed to register user" })
    }
    passport.authenticate("local")(req, res, () => {
      res.json({ success: true, message: req.user.username })
    })
  })
})

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if(err){ return res.json({ success: false, message: err }) }
    if(!user){ return res.json({ success: false, message: "no user" }) }
    req.logIn(user, (err) => {
      if(err){ return res.json({ success: false, message: err }) }
      return res.json({ success: true, username: user.username })
    })
  })(req, res)
})

router.get("/logout", (req, res) => {
  req.logout()
  res.json({ success: true, message: "logged out" })
})

module.exports = router