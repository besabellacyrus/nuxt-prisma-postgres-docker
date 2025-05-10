import { prisma } from "@/server/utils/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { setCookie } from "h3";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid login" });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email, deletedAt: null },
  });

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "User not found" });
  }

  const isMatch = await bcrypt.compare(
    parsed.data.password,
    user.password
  );

  if (!isMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

   const token = jwt.sign(
     { id: user.id, email: user.email },
     process.env.JWT_SECRET!,
     { expiresIn: "7d" }
   );

   await setUserSession(event, {
     user: {
       email: user.email,
       firstName: user.firstName,
       lastName: user.lastName,
     },
   });

   setCookie(event, "token", token, {
     httpOnly: true,
     sameSite: "strict",
     path: "/",
     maxAge: 60 * 60 * 24 * 7, // 7 days
   });

  return {
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
});
