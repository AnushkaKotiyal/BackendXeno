const express = require("express");
const userRouter = express.Router(); 
const passport = require("passport");
const userController = require("../Controllers/userController"); 
const { authenticateUser } = require("../Middleware/auth");

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/logout", userController.logout);

userRouter.get("/login/failed", userController.googleLoginFailed);
userRouter.get("/login/success", userController.googleLoginSuccess);
userRouter.get("/google", userController.googleAuth);
userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/login/failed",
    session: true, 
  }),
  userController.googleAuthCallback
);

module.exports = userRouter;
 