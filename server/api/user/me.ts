// // import { useAuth } from "nuxt-auth-utils";
// import { prisma } from "~/server/utils/prisma";

// export default defineEventHandler(async (event) => {
//   const { user } = await useAuth(event); // Retrieve user from the session or token
//   console.log({ user });
//   if (!user) {
//     throw createError({ statusCode: 401, message: "Unauthorized" });
//   }

//   // Fetch user data from the database
//   const userData = await prisma.user.findUnique({
//     where: { email: user.email },
//   });

//   if (!userData) {
//     throw createError({ statusCode: 404, message: "User not found" });
//   }

//   return userData;
// });

import { defineEventHandler, getHeader } from "h3";
import { prisma } from "~/server/utils/prisma"; // assuming you have a Prisma helper
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      body: { error: "Unauthorized" },
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };
    console.log({ payload });
    // const user = await prisma.user.findUnique({
    //   where: { id: payload.userId },
    //   select: {
    //     id: true,
    //     email: true,
    //     firstName: true,
    //     role: true,
    //   },
    // });

    // if (!user) {
    //   throw new Error("User not found");
    // }

    // return user;
  } catch (error) {
    return {
      statusCode: 401,
      body: { error: "Invalid token" },
    };
  }
});
