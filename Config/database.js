const mongoose=require('mongoose');
require('dotenv').config();
const dbConnect=()=>{ 
    mongoose.connect(process.env.DATABASE_URL||"mongodb://localhost:27017/myDatabase",{
        useNewUrlParser:true,
        useUnifiedTopology:true, 
    }) 
    .then(()=>console.log("DB Connection Successfull"))
    .catch((err)=>{
        console.log("Issue in DB Connection");
        console.log(err.message);
        process.exit(1);
    })
}

module.exports=dbConnect;