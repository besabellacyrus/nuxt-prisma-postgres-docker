// import { prisma } from "@/server/utils/prisma";

// export default defineEventHandler(async (event) => {
//   const { user } = await requireUserSession(event);
//   console.log({ usersssss: user })
//   if (!user) return;
//   const users = await prisma.user.findMany({
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       createdAt: true,
//     },
//   });
//   return users;
// });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt((query.page as string) || "1");
  const pageSize = parseInt((query.pageSize as string) || "10");

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    total,
  };
});
