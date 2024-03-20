const nodemailer = require('nodemailer');
const users = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { transporter } = require("../config/emailConfig");
// Import nodemailer for email sending

const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:587 ,
  secure: false,
  auth: {
    user:'meetsoni784@gmail.com',
    pass: 'meet@123',
  },
});


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const secretKey = 'net ninja secret'; // You should use a secure secret key

const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

async function handleUserSignup(req, res) {
  try {
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 10); // 10 is the salt rounds
    
    // Replace the plain text password with the hashed password
    data.password = hashedPassword;
    console.log(data.password);
    const exist =await users.findOne({email:data.email})
   
    if(exist){
      res.send({"status":"failed","message":"Email alredy Exists"})
      console.log("response send successfully");
    }
    else {
      // Insert new user data into the database
      const user = await users.create(data);
    
      console.log(user);
      const saved_user = await users.findOne({email: user.email});
      console.log(saved_user);
    
      // Generate JWT token
      const token = jwt.sign({userID: saved_user._id}, "ATLANTIC_CANADA", {expiresIn: '5d'}); // Assuming user has _id field
    
      // Set the token as a cookie with additional attributes
      res.cookie('jwt', token, {
        httpOnly: true, // Cookie is only accessible via HTTP(S)
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days expiration
        sameSite: 'None', // Allow cross-origin requests
        secure: true // Only send the cookie over HTTPS
      });
    
      // Respond with the user data and token
      res.status(201).json({ "status": "registration success", "token": token });
    
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await users.findOne({ email });
   
    if (!user) {
      // Email not found, send specific error
      return res.status(404).json({ error: 'Email not found' });
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    if (!isPasswordValid) {
      // Password is incorrect, send specific error
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token =jwt.sign({userID:user._id},"ATLANTIC_CANADA",{expiresIn:'5d'})// Assuming user has _id field


    console.log(token);

    res.send({
      message:'success',
      token:token
    })

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function changeUserPassword(req,res){
  console.log("happy birthday")
}
async function logout_get (req, res)  {
  res.cookie('jwt', '', { maxAge: 1 });
  res.send('cookie deleted');
}



async function sendUserPasswordResetEmail(req,res){
      const {email} =req.body;

      if(email){
          const user = await users.findOne({email:email});
          console.log(user);
          const secret=user._id + 'ATLANTIC_CANADA';
          if(user){
              const token=jwt.sign({userID: user._id}, secret, {expiresIn: '15m'});
              const link=`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
              console.log(link);
              console.log(transporter);
              // send email
              let info = await transporter.sendMail({
                from:"meetsoni784@gmail.com",
                to:user.email,
                subject:"ATLANTIC-CANADA PASSWORD RESET LINK",
                html:`<a href=${link}>Click here to reset you passwprd</a>`
              });
              res.send({"status":"seccess","message":"Paaword Reset email sent please check your email"})
          }
      }

      else{
        res.send({"status":"failed","message":"email doesn't exists"})
      }
}


async function userPasswordReset(req,res){
    const {password,password_confirmation}=req.body;
    const {id,token} = req.params;
    const user=await users.findById(id);
    const new_secret=user._id+"ATLANTIC_CANADA";
    try{
      jwt.verify(token,new_secret);
      if(password && password_confirmation){
        if(password !== password_confirmation){
          res.send({"status":"failed","message":"New password and confirm new password doesn't match "})
        }
        else{
          const salt=await bcrypt.genSalt(10);
          const newhashedpassword=await bcrypt.hash(password,salt);
          await users.findByIdAndUpdate(user._id,{$set:{password:newhashedpassword}});
          res.send({"status":"success","message":"password reset successfully"});
        }
      }
      else{
        res.send({"status":"failed","message":"All fields are required"})
      }
    }

    catch(error){
        console.log(error);
        res.send({"status":"failed","message":"Invalid Token"})
    }
}
module.exports = {
  handleUserSignup,
  handleUserLogin,
  changeUserPassword,
  logout_get,
  sendUserPasswordResetEmail,
  userPasswordReset
};
