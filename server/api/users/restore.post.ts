import { prisma } from "@/server/utils/prisma";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID",
    });
  }

  const { id } = parsed.data;

  // Check if user exists (even if soft-deleted)
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || !user.deletedAt) {
    throw createError({
      statusCode: 404,
      message: "User not found or not deleted",
    });
  }

  // Restore the user
  const restoredUser = await prisma.user.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });

  return restoredUser
});
