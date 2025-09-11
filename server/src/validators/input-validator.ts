import z from "zod";

export const inputValidator = z.object({
  prompt: z.string({ error: "Prompt is required" }),
  aspectRatio: z.string({ error: "Aspect Ratio is required" }),
});
