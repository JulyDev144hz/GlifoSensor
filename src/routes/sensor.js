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
// put sensor
router.put("/sensor/:id", (req,res)=>{
    let {id} = req.params
    const {name, coords, co2} = sensorSchema(req.body)

    if (coords.length != 0){
        sensorSchema
        .updateOne({_id:id}, {$set :{name, coords, co2}})
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
        
    }else{
        sensorSchema
        .updateOne({_id:id}, {$set :{name : name,co2: co2}})
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
    }
    
})

// remove sensor
router.delete("/sensor/:id", (req,res)=>{
    let {id} = req.params

    sensorSchema
        .findOneAndDelete({_id:id})
        .then((data) => res.json(data))
        .catch((error) => res.json({"message" : error}))
})


module.exports = router

