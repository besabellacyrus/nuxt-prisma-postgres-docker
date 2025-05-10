import { prisma } from "@/server/utils/prisma";

import { z } from "zod";

const schema = z.object({ id: z.string().uuid() });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = schema.safeParse(body);
  console.log({ data: parsed});

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: "Invalid input" });
  }

  const { id } = parsed.data;
  const permanentDelete = await prisma.user.delete({
    where: { id }
  });

  return permanentDelete;
});