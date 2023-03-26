const mongoose = require("mongoose")

const infoSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true
    },
    formula:{
        type:String,
        required:false
    }

})


module.exports = mongoose.model("Info", infoSchema)