const express = require("express");
const userRouter = express.Router(); 
const userController = require("../Controllers/userController"); 

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/logout", userController.logout);

userRouter.get("/login/failed", userController.googleLoginFailed);
userRouter.get("/login/success", userController.googleLoginSuccess);
userRouter.get("/google", userController.googleAuth);
userRouter.get("/google/callback", userController.googleAuthCallback);

module.exports = userRouter;
