import jwt from "jsonwebtoken";
import { jwtPayloadSchema } from "~/utils/authSchema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const parsed = jwtPayloadSchema.safeParse(decoded);
    if (!parsed.success) return null;
    return parsed.data;
  } catch (err) {
    return null;
  }
}
