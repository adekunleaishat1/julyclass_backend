const mongoose = require("mongoose")

const userschma = mongoose.Schema({
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email:{type:String, required:true, unique: true,},
    password:{type:String,required:true},
    proileimage:{type:String, }

})

 const usermodel = mongoose.model("user_collection", userschma,)



 


 module.exports = usermodel