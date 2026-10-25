import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";


export const globalErrorHandler = (
    err:any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
  console.log("reached global error handler");
  if(process.env.NODE_ENV !== "production") {
    console.error("🔥 Error:", err);
  }

  // Prisma unique error
  if(err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }

  // prisma record not found
  if(err.code === "P2025") {
    return res.json({
      success: false,
      message: "Record not found"
    })
  }

  // foreign key errors
  if(err.code === "P2003") {
    const field = err.meta?.field_name?.split("_")[1] || "foreign key";
    return res.status(400).json({
      success: false,
      message: `Invalid reference for ${field}`,
    });
  }

  // Zod validation error
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  // Unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: err
  });
}