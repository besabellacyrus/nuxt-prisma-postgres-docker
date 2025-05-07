import { z } from "zod";

export const jwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  exp: z.number(),
});
