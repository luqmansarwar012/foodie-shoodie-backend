import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// signup route
userRouter.post("/register", registerUser);

// login route
userRouter.post("/login", loginUser);

export default userRouter;
