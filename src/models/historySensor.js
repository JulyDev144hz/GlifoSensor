const mongoose = require("mongoose")

const historySensorSchema = mongoose.Schema({
    idSensor:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    timeStamp:{
        type:String,
        required:true
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


module.exports = mongoose.model("historySensor", historySensorSchema)