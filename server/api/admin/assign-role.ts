import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId || !body.roleId) {
    throw createError({ statusCode: 400, message: "Invalid input" });
  }

  await prisma.user.update({
    where: { id: body.userId },
    data: { roleId: body.roleId },
  });

  return { message: "Role updated" };
});
