import { z } from 'zod';

export const complaintSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }).max(100),
  block: z.string().min(1, { message: "Block is required." }).max(50),
  issue: z.string().min(10, { message: "Issue description must be at least 10 characters." }).max(1000),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
