import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
  return users;
});
