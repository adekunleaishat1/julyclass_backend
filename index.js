const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()
const userrouter = require("./Route/userrouter")
const cors = require("cors")

app.use(cors({origin:"*"}))
app.use(express.urlencoded({extended: true}))
app.use(express.json({extended:true, limit:"50mb"}))
app.use("/user", userrouter)





const connect = () =>{
    try {
       const connection = mongoose.connect(process.env.URI)
       if (connection) {
        console.log("connected to database");
       }
 
    } catch (error) {
        console.log(error);
    }
}

connect()
 

const port = process.env.PORT

app.listen(port, ()=>{
  console.log(`app started at port ${port} `);
})