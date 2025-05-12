import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;
  const search = String(query.search || "").toLowerCase();

  const where = {
    ...(search
      ? {
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        }
      : {}),
  };

  const [roles, total] = await prisma.$transaction([
    prisma.role.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        users: true,
      },
    }),
    prisma.role.count({ where }),
  ]);

  return {
    data: roles,
    total,
  };
});
