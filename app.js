const express = require("express");
const bodyParser = require("body-parser");
var exphbs = require('express-handlebars');
const { requireAuth } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5500;

const router = express.Router();
const users = require("./models/user");
const svs_bank=require("./models/svs_bank");
const svs_gas_stations=require("./models/svs_gas_stations");
const svs_grocery_stores=require("./models/svs_grocery_stores");
const svs_public_transport=require("./models/svs_public_transport");
const svs_realest_agents=require("./models/svs_realest_agents");
const svs_phone_providers= require("./models/svs_phone_providers");
const svs_rdside_asist=require("./models/svs_rdside_asist");
const svs_imgn_consult=require("./models/svs_imgn_consult");
const youtube_links=require("./models/youtube_links");
const sub_services=require("./models/sub_services");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use("/user/",authRoutes);
app.use(cors({
  credentials:true,
  origin:['http://localhost:3000']
}))

mongoose.connect('mongodb+srv://rushipatel8733074210:admin1234@cluster0.6awdf.mongodb.net/Atlantic_Canada', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.log("Getting an error:", err));




const serviceSchema = new mongoose.Schema({
 
    svs_name:{
        type:String
    },
    svs_loc:{
        type:String
    },
    svs_contact:{
        type:String
    },
    svs_image:{
        type:String
    },
    svs_info:{
        type:String
    }
    
  });

  
const Services = mongoose.model('services', serviceSchema);



//

app.get("/api/services", async (req, res) => {

  try {
    // Assuming you want to fetch all documents from the 'bank_name' collection
    
    const data = await Services.find({});
    console.log(data);

    res.json(data);
    console.log("data fetching done")

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get("/update/:id", async (req, res) => {
    const itemId = req.params.id;
    console.log(itemId);
  
    try {
      // Assuming Services is your Mongoose model
      const data = await Services.findById(itemId); // Use findById directly
      console.log(data);
  
      if (!data) {
        // If no data is found for the given ID
        return res.status(404).json({ error: 'Data not found' });
      }
  
      res.json(data);
      console.log("Data fetching done");
  
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.post("/api/services/adddata", async (req, res) => {

    try {

      const data=req.body;
    //   console.log("data fetching done")
      result=res.json(data);
      console.log(data);

      const service=await Services.insertMany(data);
      console.log("data added")
  
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



// delete data

app.delete('/api/delete/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        // Find the item in the Services collection
        const service = await Services.findOneAndDelete({ _id: itemId });

        if (service) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.put("/update/:id", async (req, res) => {
    const itemId = req.params.id;
    console.log(itemId);
    const updatedData = req.body; // Assuming the updated data is sent in the request body
    console.log(updatedData);
    try {
      // Find the document by ID and update it
      const updatedDocument = await Services.findByIdAndUpdate(itemId, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validators on the update
      });
  
      if (!updatedDocument) {
        return res.status(404).json({ error: 'Data not found' });
      }
  
      res.json(updatedDocument);
      console.log("Data updated successfully");
  
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // app.post("/api/addUser", async (req, res) => {

  //   try {

  //     const data=req.body;
  //   //   console.log("data fetching done")
  //     result=res.json(data);
  //     console.log(data);

  //     const user=await users.insertMany(data);
  //     console.log("data added")
  
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });



  // app.post("/api/addUser", async (req, res) => {

  //   try {

  //     const data=req.body;
  //   //   console.log("data fetching done")
  //     result=res.json(data);
  //     console.log(data);

  //     const user=await users.insertMany(data);
  //     console.log("data added")
  
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });

  // app.post("/logindata", async (req, res) => {

  //   try {
  //     const { email, password } = req.body;

  //     // Assuming users is a model or query interface
  //     const user = await users.findOne({ email, password });

  //     if (!user) {
  //         return res.status(404).json({ error: 'User not found' });
  //     }

  //     // User found, you can do something with user data
  //     console.log('User found:', user);

  //     // Respond with user data (remove redundant response)
  //     res.status(200).json(user);
  // } catch (error) {
  //     console.error('Error fetching data:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  // }
  // });

  


  app.get("/api/getUser", async (req, res) => {

    try {
      // Assuming you want to fetch all documents from the 'bank_name' collection
      
      const data = await users.find({});
      console.log(data);
  
      res.json(data);
      console.log("data fetching done")
  
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  //routes for services 
  app.get("/api/services/:param1", async (req, res) => {
    try {
      const id = req.params.param1;
      const data = await sub_services.find({svs_id:id});
   const newdata=JSON.parse(JSON.stringify(data));

    
      
      if (!data) {
        return res.status(404).json({ error: 'Data not found' });
      }
      
      res.json(newdata);
      console.log("Data fetching done");
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 
  // specific service
  app.get("/api/services/:param1/:param2", async (req, res) => {
    try {
      const name = req.params.param2;
      const data = await sub_services.find({subsvs_name:name});
   const newdata=JSON.parse(JSON.stringify(data));

    
      
      if (!data) {
        return res.status(404).json({ error: 'Data not found' });
      }
      console.log(newdata)
      res.json(data);
      console.log("Data fetching done");
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



//youtube api
app.get("/api/youtube",async(req,res)=>{
  try {
    
   
    const data = await youtube_links.find({});
   const newdata=JSON.parse(JSON.stringify(data));
   ;
   console.log(newdata);
    res.json(newdata);
  
    
      console.log("data fetching done")
    

  

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
