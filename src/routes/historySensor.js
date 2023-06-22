const express = require("express")
const router = express.Router()
const historySensorSchema = require("../models/historySensor")

// get all sensors
router.get("/historySensor", (req,res)=>{
    historySensorSchema
        .find()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})
router.get("/historySensor/:id", (req,res)=>{
    let {id} = req.params

    historySensorSchema
        .find({"idSensor":id})
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})

// post sensor
router.post("/historySensor", (req,res)=>{
    const sensor = historySensorSchema(req.body)


    sensor
        .save()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
})
// put sensor
router.put("/historySensor/:id", (req,res)=>{
    let {id} = req.params
    const {name, coords, co2, humedad, temperatura} = historySensorSchema(req.body)
    const updatedAt = new Date().toLocaleString()

    
    if (coords.length != 0){
        sensorSchema
        .historySensorSchema({_id:id}, {$set :{name, coords, updatedAt, co2, humedad, temperatura}})
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
        
    }else{
        sensorSchema
        .historySensorSchema({_id:id}, {$set :{humedad, temperatura}})
        .then((data)=> res.json(data))
        .catch((error)=> res.json({"message": error}))
    }
    
})

// remove sensor
router.delete("/historySensor/:id", (req,res)=>{
    let {id} = req.params

    historySensorSchema
        .findOneAndDelete({_id:id})
        .then((data) => res.json(data))
        .catch((error) => res.json({"message" : error}))
})


module.exports = router

