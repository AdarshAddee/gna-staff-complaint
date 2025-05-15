import { z } from 'zod';

export const complaintSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }).max(100),
  block: z.string().min(1, { message: "Block is required." }).max(50),
  issue: z.string().max(10000, { message: "Issue description cannot exceed 10000 characters." }), // Increased max length, removed min
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
