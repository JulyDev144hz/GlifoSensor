const userRoutes = require("./routes/user")
const sensorRoutes = require("./routes/sensor")
const historySensor = require('./routes/historySensor')
const morgan = require("morgan")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()


const app = express()
app.use(morgan("tiny"))
app.use(cors())
const port = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/",userRoutes)
app.use("/",sensorRoutes)
app.use("/", historySensor)

//routes

app.get("/",(req,res)=>{
    res.send("Welcome")
})


// mongodb connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>{
    console.log("Connected to MongoDB Atlas")
    })
    .catch(()=>{
        console.error(error)
    }) 

app.listen(port, () =>{
    console.log("server listening on port",port)
})
