// import { prisma } from "@/server/utils/prisma";

// export default defineEventHandler(async (event) => {
//   const query = getQuery(event);

//   const page = parseInt((query.page as string) || "1");
//   const pageSize = parseInt((query.pageSize as string) || "10");

//   const where = {
//     deletedAt: null,
//   };

//   const [users, total] = await prisma.$transaction([
//     prisma.user.findMany({
//       where,
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//       orderBy: {
//         createdAt: "desc",
//       },
//     }),
//     prisma.user.count({
//       where,
//     }),
//   ]);

//   return {
//     data: users,
//     total,
//   };
// });

import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;
  const search = String(query.search || "").toLowerCase();
  const isActive = query.active === 'true'

  console.log({ isActive  });
  const where = {
    deletedAt: isActive ? null : { not: null },
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    total,
  };
});

