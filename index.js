const express=require('express');
const app=express();
const cors=require('cors');
const passport=require('passport');
const dbConnect=require('./Config/database');
const session = require('express-session'); 
require('./passport');
const userRouter=require('./Routes/userRoutes');
const customerRouter=require('./Routes/customerRoutes');
const segmentationRouter=require('./Routes/segmentationRoutes');
const orderRouter=require('./Routes/orderRoutes');
const campaignRouter = require('./Routes/campaignRoutes');
const communicationRouter = require('./Routes/communicationRoutes');
dbConnect();
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true
}));
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
