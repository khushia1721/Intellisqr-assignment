"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.ErrorHandle = void 0;
class ErrorHandle extends Error {
    constructor(message, statusCode, serverSideError) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.serverSideError = serverSideError;
    }
}
exports.ErrorHandle = ErrorHandle;
const ErrorHandler = async (error, req, res, next) => {
    try {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
    catch (err) {
        console.error("Error handler failed", err);
        res.status(500).send("Failed to handle error");
    }
};
exports.ErrorHandler = ErrorHandler;
