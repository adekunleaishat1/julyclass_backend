const mailer = require('nodemailer')


const useremail = async (email, firstname) =>{

    const messageTemplate =  `
    <div>
        <h2>Welcome!!!</h2>
        <ul>
            <li>Name: ${firstname}</li>
            <li>Email: ${email}</li>
        </ul>
        <div>
            <p>Dear ${firstname}, </p>
            <p>Welcome to Suitroh Nigeria Limited </p>
        </div>
    </div>
`;


    const transporter =    mailer.createTransport({
        service: "gmail",
        auth:{
            user:process.env.USER_EMAIL ,
            pass:process.env.USER_PASS        
        }
     })

     const mailOptions = {
        from:process.env.USER_EMAIL,
        to: email,
        subject: "Welcome message" ,
        html:messageTemplate
    }


    try {
      const sentmail =  await transporter.sendMail(mailOptions)
      if (sentmail) {
        console.log("mail sent successful");
      }
    } catch (error) {
        console.log(error.message);
          throw{
            errorname:"Mailerror",
            message:error.message
          }
    }


}


module.exports ={useremail}