import { z } from "zod";

export const leadSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  phone_number: z.string(),
  created_time: z.string(),
  facebook_page_id: z.number(),
  facebook_page_name: z.string(),
  status: z.string(),
  // Inclua outros campos conforme necessário
});

export type Lead = z.infer<typeof leadSchema>;
