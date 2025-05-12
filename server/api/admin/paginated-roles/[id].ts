// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const id = Number(event.context.params.id);
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
    const role = await prisma.role.findUnique({
      where: { id }, // use roleId or name
      include: { users: true },
    });

    if (role && role.users.length === 0) {
      await prisma.role.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } else {
      throw new Error(
        "Cannot update role — it is assigned to one or more users."
      );
    }
  }

  return { error: "Method not supported" };
});
