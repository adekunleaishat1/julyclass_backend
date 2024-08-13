 const usermodel = require("../Model/userModel")
 const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require("../utils/cloudinary")
const {useremail} = require("../utils/nodemailer")

const Signup = async (req ,res) =>{
  try {
    console.log( req.body);
    const {firstname, lastname, email, password} = req.body
   if (!firstname || !lastname || !email || !password ) {
    res.status(400).send({message:"input field cannot be empty", status:false})
   }else{
     const existuser = await usermodel.findOne({email: email})
     if (existuser) {
        res.status(402).send({message:"user already exist", status:false})
     }else{
       const hashpassword =  await bcrypt.hash(password, 10)
        const newuser = await usermodel.create({
          firstname,
          lastname,
          email,
          password:hashpassword
        })
        await useremail(email, firstname)
        if (newuser) {
         return res.status(200).send({message:"signup successful", status:true})
        }
     }
   }
  } catch (error) {
    console.log(error);
    res.status(500).send({message:error.message, status:false})
  }
}

const Login = async (req, res) =>{
    console.log(req.body);
    const {email, password} = req.body
  try {
    if (!email || !password) {
      res.status(400).send({message:"input field cannot be empty", status:false})
    }
    const existuser =  await usermodel.findOne({email})
    if (!existuser) {
      res.status(402).send({message:"Not a registered user ; please sign up.", status:false})
    }else{
       const comfirmpassword =  await bcrypt.compare(password , existuser.password)

       if (!comfirmpassword) {
        res.status(405).send({message:"Invalid password", status:false})

       }else{
          const token = await jwt.sign({email}, "secretKey", {expiresIn:'1d'})
          console.log(token);
        return res.status(200).send({message:"login successful", status:true, token})
       }
    }
  } catch (error) {
     console.log(error);
    res.status(500).send({message:error.message, status:false})
  }
}


const verifydashboard = async (req, res)=>{
  try {
    const token = req.headers.authorization.split(" ")[1]
   if (!token) {
     res.status(402).send({message:"Invalid token", status:false})
   }else{
      console.log(token);
      const verifytoken = await jwt.verify(token, "secretKey")
      console.log(verifytoken)
      const email = verifytoken.email
     const verifyuser =   await usermodel.findOne({email})
     if (verifyuser) {
      res.status(200).send({message:"user is verified", status:true, verifyuser})
     } 
   }
  } catch (error) {
    if (error.message ==  "jwt malformed" ) {
      console.log("incorrect token");
      res.status(402).send({message:"incorrect token", status:false})
    }else{
        console.log(error);
        res.status(500).send({message:error.message, status:false})
    }
   
  }
}

const updateprofile = async(req, res) =>{
    console.log(req.body);
    const {imagefile} = req.body
    const token = req.headers.authorization.split(" ")[1]
    if (!imagefile) {
      res.status(400).send({message:"image cannot be empty",status:false })
    }
   const verifytoken = await jwt.verify(token, "secretKey")
   const email = verifytoken.email
   console.log(verifytoken);
     if (!email) {
      res.status(400).send({message:"invalid token",status:false })
     }else{
      const image = await cloudinary.uploader.upload(imagefile)

      console.log(image.secure_url);
      const upload = await usermodel.findOneAndUpdate(
       {email},
       {proileimage: image.secure_url},
       {new: true}
      )
      if (upload) {
        res.status(200).send({message:"profile upload succesful",status:true })
      }else{
        res.status(405).send({message:"error occured while uploading profile",status:false })
      
      }
     }

    

}  


module.exports = {Signup, Login, verifydashboard, updateprofile}