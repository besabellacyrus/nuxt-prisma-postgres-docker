import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("api called");

  const { name } = body;

  console.log({ nma: name });

  if (name === "") {
    throw createError({
      statusCode: 400,
      statusMessage: "Empty data.",
    });
  }
  const roleExist = await prisma.role.findUnique({ where: { name } });

  if (roleExist) {
    throw createError({
      statusCode: 409,
      statusMessage: "Role already exists",
    });
  }

  const role = await prisma.role.upsert({
    where: { name: name }, // check if a role named 'Admin' exists
    update: {}, // if it exists, do nothing (no update)
    create: {
      // if it doesn't exist, create it
      name: name,
    },
  });

  return {
    id: role.id,
    name: role.name,
  };
});
