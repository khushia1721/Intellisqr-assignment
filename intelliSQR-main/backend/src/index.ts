import express, { NextFunction, Request, Response } from "express";
import prisma from "./utils/prismaDb.js";
import { config } from "dotenv";
import cors from "cors";
import { ErrorHandle, ErrorHandler } from "./utils/errorHandle.js";
const app = express();
app.use(cors());
app.use(express.json());
const router  = express.Router();
app.get("/",(req,res)=>{
  res.send("hello");
});

app.use("/",router);

router.post("/signUp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandle("Please provide email and password", 400, false)
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ErrorHandle("User already exists", 400, false));
    }

    const newUser = await prisma.user.create({
      data: { email, password: password },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandle("Failed to sign up", 500, true));
  }
});

router.post("/signIn", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandle("please provide both email and password", 400, false)
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new ErrorHandle("Invalid email or password", 401, false));
    }

    if (user.password !== password) {
      return next(new ErrorHandle("Invalid email or password", 401, false));
    }
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      user: { ...user },
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandle("failed to signIn", 500, true));
  }
});

app.use((error: ErrorHandle, req: Request, res: Response, next: NextFunction) =>
  ErrorHandler(error, req, res, next)
);
app.listen(5000, () => {
  console.log("app is listening");
});
