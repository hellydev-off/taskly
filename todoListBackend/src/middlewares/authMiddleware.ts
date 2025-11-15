import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
  email?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    ) as any;

    req.userId = decoded.id;
    req.username = decoded.username;
    req.email = decoded.email;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(403).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(403).json({ message: "Invalid token" });
    } else {
      res.status(403).json({ message: "Token verification failed" });
    }
  }
};
