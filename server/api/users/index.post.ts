import { prisma } from "@/server/utils/prisma";
import { z } from "zod";
// import { hashPassword } from "~/server/utils/hash";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
    });
  }
  const { name, email, password } = parsed.data;
  const userExists = await prisma.user.findUnique({ where: { email }});

  if (userExists) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    });
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashed,
    },
  });

  return { id: user.id, name: user.name, email: user.email };
});
