import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(5, { message: "content must be al least 5 characters!" })
    .max(300, { message: "content must not exceed 300 characters!" }),
});
