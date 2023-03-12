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
    temperatura:{
        type:Number,
        required:true
    },
    humedad:{
        type:Number,
        required:true
    }
})


module.exports = mongoose.model("Sensor", sensorSchema)