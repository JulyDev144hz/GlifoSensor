const mongoose = require("mongoose")

const sensorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    coords:{
        type:Array,
        required:true
    },
    createdAt:{
        type:String,
        default:new Date().toLocaleString,
        required:false
    },
    updatedAt:{
        type:String,
        default:new Date().toLocaleString(),
        required:false
    },
    temperatura:{
        type:Number,
        required:true
    },
    humedad:{
        type:Number,
        required:true
    },
    co2:{
        type:Number,
        required:true
    }
})


module.exports = mongoose.model("Sensor", sensorSchema)