const express = require("express")
const userSchema = require("../models/user")

const router = express.Router()

// create user

router.post("/users", (req, res) => {
    const user = userSchema(req.body)

    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})
//get all users
router.get("/users", (req, res) => {
    userSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})
//get user
router.get("/users/:id", (req, res) => {
    let { id } = req.params
    userSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})
// update user
router.put("/users/:id", (req, res) => {
    let { id } = req.params
    let {name, age} = req.body
    userSchema
        .updateOne({_id : id}, {$set : {name: name, age: age}})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})
// remove user
router.delete("/users/:id", (req, res) => {
    let { id } = req.params
    userSchema
        .findByIdAndRemove({_id : id})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }))
})


module.exports = router