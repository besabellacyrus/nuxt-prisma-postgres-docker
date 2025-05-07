import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default-secret";

export const createToken = (payload: object) =>
  jwt.sign(payload, secret, { expiresIn: "1h" });

export const verifyToken = (token: string) => jwt.verify(token, secret);
