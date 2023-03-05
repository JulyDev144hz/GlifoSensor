const express = require("express")
const router = express.Router()
const sensorSchema = require("../models/sensor")

// get all sensors
router.get("/sensor", (req,res)=>{
    sensorSchema
        .find()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})
router.get("/sensor/:id", (req,res)=>{
    let {id} = req.params

    sensorSchema
        .findById(id)
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})

// post sensor
router.post("/sensor", (req,res)=>{
    const sensor = sensorSchema(req.body)


    sensor
        .save()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})


module.exports = router

