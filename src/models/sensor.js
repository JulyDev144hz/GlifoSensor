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
    co2:{
        type:Number,
        required:true
    }
})


module.exports = mongoose.model("Sensor", sensorSchema)