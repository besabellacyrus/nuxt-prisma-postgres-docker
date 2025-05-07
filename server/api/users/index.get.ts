import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  console.log({ usersssss: user })
  if (!user) return;
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
