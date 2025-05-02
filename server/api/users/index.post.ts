import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password, // Note: hash the password in production
    },
  });

  return user;
});
