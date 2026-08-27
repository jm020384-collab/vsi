import { z } from "zod";

export const reviewSchema = z.object({
  therapistSlug: z.string().min(1),
  authorName: z.string().min(2).max(80),
  authorEmail: z.string().email(),
  content: z
    .string()
    .min(40, "Відгук має бути щонайменше 40 символів")
    .max(2000, "Максимум 2000 символів"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Потрібна згода на публікацію" }),
  }),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
