import { z } from 'zod';

export const complaintSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }).max(100),
  block: z.string().min(1, { message: "Block is required." }).max(50),
  roomNo: z.string().max(50, { message: "Room number cannot exceed 50 characters."}).optional().default(""),
  issue: z.string().max(5000000, { message: "Issue description cannot exceed 5000000 characters." }), 
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;