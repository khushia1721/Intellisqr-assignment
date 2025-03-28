"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaDb_js_1 = __importDefault(require("./utils/prismaDb.js"));
const cors_1 = __importDefault(require("cors"));
const errorHandle_js_1 = require("./utils/errorHandle.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const router = express_1.default.Router();
app.get("/", (req, res) => {
    res.send("hello");
});
app.use("/", router);
router.post("/signUp", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandle_js_1.ErrorHandle("Please provide email and password", 400, false));
        }
        const existingUser = await prismaDb_js_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new errorHandle_js_1.ErrorHandle("User already exists", 400, false));
        }
        const newUser = await prismaDb_js_1.default.user.create({
            data: { email, password: password },
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { email: newUser.email },
        });
    }
    catch (error) {
        console.error(error);
        return next(new errorHandle_js_1.ErrorHandle("Failed to sign up", 500, true));
    }
});
router.post("/signIn", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandle_js_1.ErrorHandle("please provide both email and password", 400, false));
        }
        const user = await prismaDb_js_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return next(new errorHandle_js_1.ErrorHandle("Invalid email or password", 401, false));
        }
        if (user.password !== password) {
            return next(new errorHandle_js_1.ErrorHandle("Invalid email or password", 401, false));
        }
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: { ...user },
        });
    }
    catch (error) {
        console.error(error);
        return next(new errorHandle_js_1.ErrorHandle("failed to signIn", 500, true));
    }
});
app.use((error, req, res, next) => (0, errorHandle_js_1.ErrorHandler)(error, req, res, next));
app.listen(5000, () => {
    console.log("app is listening");
});
