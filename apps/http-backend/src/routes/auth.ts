import { Router } from "express";
import { registerService } from "../services/auth/register";
import { verifyOTPService } from "../services/auth/verifyOtp";
import { loginService } from "../services/auth/login";

export const authRouter: Router = Router();

authRouter.post("/register", registerService);
authRouter.post("/verify-otp/:phone", verifyOTPService);
authRouter.post("/login", loginService);
