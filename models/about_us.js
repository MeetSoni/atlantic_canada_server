const { Int32 } = require("mongodb");
const mongoose=require("mongoose");

const aboutusSchema = new mongoose.Schema({
    __id: {
      type: Int32,
    },
    about_emp_img:{
        type:String
    },
    
about_emp_name:{
        type:String
    },
    about_emp_job_title:{
        type:String
    },
    about_emp_desc:{
        type:String
    }
    
  });

  
const about_us = mongoose.model('about_us', aboutusSchema);

module.exports = Services;
