"use server";

import { z } from 'zod';
import { database, ref, runTransaction, set } from '@/lib/firebase';
import type { Complaint } from '@/types';
import { complaintSchema } from '@/components/complaint-form-schema';

export type FormState = {
  message: string;
  success: boolean;
  srNo?: number;
  errors?: {
    [key in keyof z.infer<typeof complaintSchema>]?: string[];
  } & { server?: string[] };
};

export async function submitComplaintAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const rawFormData = {
    name: formData.get('name'),
    department: formData.get('department'),
    block: formData.get('block'),
    issue: formData.get('issue'),
  };

  const validatedFields = complaintSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const counterRef = ref(database, 'counters/gnaComplaintsSrNo');
    let newSrNo: number = 0;

    const transactionResult = await runTransaction(counterRef, (currentData: number | null) => {
      if (currentData === null) {
        return 1;
      }
      return currentData + 1;
    });

    if (transactionResult.committed && transactionResult.snapshot.exists()) {
      newSrNo = transactionResult.snapshot.val() as number;
    } else {
      console.error("Failed to commit transaction or snapshot doesn't exist", transactionResult);
      return { 
        message: "Failed to generate serial number. Please try again.", 
        success: false,
        errors: { server: ["Failed to generate serial number. Please try again."] }
      };
    }

    if (newSrNo === 0) {
       return { 
        message: "Invalid serial number generated. Please try again.", 
        success: false,
        errors: { server: ["Invalid serial number generated. Please try again."] }
      };
    }

    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const complaintData: Complaint = {
      'sr-no': newSrNo,
      date: currentDate,
      name: data.name,
      dept: data.department,
      block: data.block,
      complaints: data.issue,
      status: "Pending",
      'date-solved': ""
    };

    const complaintRef = ref(database, `gna-complaints/${newSrNo}`);
    await set(complaintRef, complaintData);

    return { 
      message: `Complaint submitted successfully! Your complaint S.No is ${newSrNo}.`,
      success: true,
      srNo: newSrNo 
    };

  } catch (error) {
    console.error("Error submitting complaint:", error);
    let errorMessage = "An unexpected error occurred while submitting the complaint.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { 
      message: errorMessage, 
      success: false,
      errors: { server: [errorMessage] }
    };
  }
}
