import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async () => {
  return await prisma.role.findMany({
    select: { id: true, name: true },
  });
});
