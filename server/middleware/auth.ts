import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");

//   if (!token) {
//     throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     // Attach user info to event if needed
//     event.context.user = decoded;
//   } catch {
//     throw createError({ statusCode: 401, statusMessage: "Invalid token" });
//   }
});
