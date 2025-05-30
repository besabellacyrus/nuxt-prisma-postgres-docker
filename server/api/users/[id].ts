import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const id = event.context.params.id;
  const body = await readBody(event);

  const { firstName, lastName, email } = body;

  if (method === "PUT") {
    if (firstName === "" || lastName === "" || email === "") {
      throw createError({
        statusCode: 400,
        statusMessage: "Empty data.",
      });
    }
    const existing = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: id }, // exclude current user
      },
    });

    if (existing) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email already in use.",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    });
    console.log({ updated });
    return updated;
  }

  if (method === "DELETE") {
    const user = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return user;
  }

  return { error: "Method not supported" };
});
