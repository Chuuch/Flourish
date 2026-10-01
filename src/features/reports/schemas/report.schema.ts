import { z } from 'zod';

export const reportClientRowSchema = z.object({
  client_id: z.uuid(),
  client_name: z.string(),
  minutes: z.number().int(),
});

export const reportProjectRowSchema = z.object({
  project_id: z.uuid(),
  project_name: z.string(),
  client_id: z.uuid(),
  client_name: z.string(),
  minutes: z.number().int(),
});

export const reportMemberRowSchema = z.object({
  user_id: z.uuid(),
  email: z.email(),
  display_name: z.string().default(''),
  minutes: z.number().int(),
});

export const timeReportSchema = z.object({
  from: z.string(),
  to: z.string(),
  total_minutes: z.number().int(),
  by_client: z.array(reportClientRowSchema),
  by_project: z.array(reportProjectRowSchema),
  by_member: z.array(reportMemberRowSchema),
});

export type TimeReport = z.infer<typeof timeReportSchema>;
