const express=require('express');
const app=express();
const cors=require('cors');
const passport=require('passport');
const dbConnect=require('./Config/database');
const path = require("path");
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
require('./passport');
const userRouter=require('./Routes/userRoutes');
const customerRouter=require('./Routes/customerRoutes');
const segmentationRouter=require('./Routes/segmentationRoutes');
const orderRouter=require('./Routes/orderRoutes');
const campaignRouter = require('./Routes/campaignRoutes');
const communicationRouter = require('./Routes/communicationRoutes');
dbConnect();
app.use(cors({
  origin: "https://frontend-xeno-urwi.vercel.app", 
  credentials: true
}));
app.use(cookieParser()); 
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "Anushka", 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: 'lax',
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../frontend/my-project/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/my-project/dist/index.html"));
}); 

app.use('/user',userRouter);
app.use('/customers',customerRouter);
app.use('/segments', segmentationRouter);
app.use('/orders',orderRouter)
app.use('/campaigns',campaignRouter);
app.use('/comm',communicationRouter);
app.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Backend working Successfully",
        OperationCode:200
    })
})
app.listen(process.env.PORT||3000,()=>{
    console.log(`Server listning on Port ${process.env.PORT}`)
}) 
