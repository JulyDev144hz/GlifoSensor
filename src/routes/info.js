const express = require("express")
const router = express.Router()
const infoSchema = require("../models/info")

// get all sensors
router.get("/info", (req,res)=>{
    infoSchema
        .find()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})
router.get("/info/:id", (req,res)=>{
    let {id} = req.params

    infoSchema
        .findById(id)
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})

// post sensor
router.post("/info", (req,res)=>{
    const info = infoSchema(req.body)


    info
        .save()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})

// remove sensor
router.delete("/info/:id", (req,res)=>{
    let {id} = req.params

    infoSchema
        .findOneAndDelete({_id:id})
        .then((data) => res.json(data))
        .catch((error) => res.json({"message" : error}))
})


module.exports = router

