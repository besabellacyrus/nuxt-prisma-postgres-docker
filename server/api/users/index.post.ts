import { prisma } from "@/server/utils/prisma";


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log({ body })
  console.log("api called");

  const { firstName, lastName, email, password } = body;
  const userExists = await prisma.user.findUnique({ where: { email }});

  if (userExists) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    });
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashed,
    },
  });

  return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
});
