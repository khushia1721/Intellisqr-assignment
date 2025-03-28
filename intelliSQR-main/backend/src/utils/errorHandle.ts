import { NextFunction, Response ,Request} from "express";

export class ErrorHandle extends Error {
  public message: string;
  public statusCode: number;
  public serverSideError: boolean;
  constructor(message: string, statusCode: number, serverSideError: boolean) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.serverSideError = serverSideError;
  }
}

export const ErrorHandler = async (
  error: ErrorHandle,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  } catch (err) {
    console.error("Error handler failed", err);
    res.status(500).send("Failed to handle error");
  }
};