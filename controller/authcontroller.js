const users = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const secretKey = 'your-secret-key'; // You should use a secure secret key

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
    }
  else{
      // Insert new user data into the database
      const user = await users.create(data);

      // Generate JWT token
      const token = createToken(user._id); // Assuming user has _id field
  
      // Set the token as a cookie
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  
      // Respond with the user data and token
      res.status(200).json({ user, token });
  
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

    const token=jwt.sign({_id: user._id},'Meet Soni');
    res.cookie('jwt',token,{
      httpOnly:true,
      maxAge: 24*60*60*100
    })

    console.log(token);

    res.send({
      message:'success'
    })

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin
};
