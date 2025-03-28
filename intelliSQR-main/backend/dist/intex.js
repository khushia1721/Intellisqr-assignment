"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaDb_js_1 = __importDefault(require("./utils/prismaDb.js"));
const cors_1 = __importDefault(require("cors"));
const errorHandle_1 = require("./utils/errorHandle");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/signIn", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandle_1.ErrorHandle("please provide both email and password", 400, false));
        }
        const user = await prismaDb_js_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return next(new errorHandle_1.ErrorHandle("Invalid email or password", 401, false));
        }
        if (user.password !== password) {
            return next(new errorHandle_1.ErrorHandle("Invalid email or password", 401, false));
        }
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: { email: user.email },
        });
    }
    catch (error) {
        console.error(error);
        return next(new errorHandle_1.ErrorHandle("failed to signIn", 500, true));
    }
});
app.use((error, req, res, next) => (0, errorHandle_1.ErrorHandler)(error, req, res, next));
