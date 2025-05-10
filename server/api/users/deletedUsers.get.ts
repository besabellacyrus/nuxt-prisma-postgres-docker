import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt((query.page as string) || "1");
  const pageSize = parseInt((query.pageSize as string) || "10");


  const where = {
    deletedAt: {
      not: null,
    },
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: {
        deletedAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);
  console.log({ total })
  return {
    data: users,
    total,
  };
});