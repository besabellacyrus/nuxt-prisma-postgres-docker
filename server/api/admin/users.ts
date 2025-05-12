import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async () => {
  return await prisma.user.findMany({
    select: { id: true, firstName: true, email: true },
  });
});
