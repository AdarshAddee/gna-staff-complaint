
"use client";

import type * as React from 'react';
import { useEffect, startTransition } from 'react'; 
import { useActionState } from 'react'; // Updated import
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSchema, type ComplaintFormData } from './complaint-form-schema';
import { submitComplaintAction, type FormState } from '@/app/actions';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const initialState: FormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg rounded-md py-3 text-base font-semibold" disabled={pending} aria-disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      {pending ? 'Submitting...' : 'Submit Complaint'}
    </Button>
  );
}

export function ComplaintForm() {
  const [state, formAction] = useActionState(submitComplaintAction, initialState);
  const { toast } = useToast();

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      name: "",
      department: "",
      block: "",
      roomNo: "",
      issue: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-800 dark:border-green-600 dark:text-green-100",
        });
        form.reset(); 
      } else {
        toast({
          title: "Error",
          description: state.message || "Failed to submit complaint.",
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-800 dark:border-red-600 dark:text-red-100",
        });
      }
    }
  }, [state, toast, form]);
  
  useEffect(() => {
    if (state.errors) {
      const fieldErrors = state.errors;
      (Object.keys(fieldErrors) as Array<keyof ComplaintFormData>).forEach((key) => {
        if (fieldErrors[key] && fieldErrors[key]!.length > 0) {
          // @ts-ignore
          form.setError(key, { type: 'server', message: fieldErrors[key]![0] });
        }
      });
      if (fieldErrors.server && fieldErrors.server.length > 0) {
         toast({
          title: "Server Error",
          description: fieldErrors.server.join(', '),
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-800 dark:border-red-600 dark:text-red-100",
        });
      }
    }
  }, [state.errors, form, toast]);


  return (
    <Card className="w-full shadow-xl rounded-lg border border-border/70 bg-card/90 backdrop-blur-sm transition-all duration-300 ease-in-out">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl text-primary font-semibold">New Complaint</CardTitle>
        <CardDescription className="text-muted-foreground/80 text-sm">Please fill out the details below. Fields marked with * are required.</CardDescription>
      </CardHeader>
      <form 
        action={formAction} 
        onSubmit={form.handleSubmit((_data, event) => {
          const formElement = event?.target as HTMLFormElement | undefined;
          if (formElement) {
            startTransition(() => { // Wrap formAction in startTransition
              formAction(new FormData(formElement));
            });
          } else {
            console.error("Form element not found in handleSubmit event");
            toast({
              title: "Submission Error",
              description: "Could not process form submission. Please try again.",
              variant: "destructive",
            });
          }
        })}
      >
        <CardContent className="space-y-4 md:space-y-5 pt-2 pb-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-foreground/90 font-medium text-sm">Full Name *</Label>
            <Input 
              id="name" 
              {...form.register("name")} 
              placeholder="Enter your full name" 
              aria-invalid={form.formState.errors.name ? "true" : "false"}
              className="bg-input/80 placeholder:text-muted-foreground/60 border-border/80 focus:border-primary focus:ring-primary/50 transition-colors duration-200"
            />
            {form.formState.errors.name && <p className="text-xs text-destructive pt-1">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-foreground/90 font-medium text-sm">Department *</Label>
            <Input 
              id="department" 
              {...form.register("department")} 
              placeholder="e.g., IT, HR, Maintenance" 
              aria-invalid={form.formState.errors.department ? "true" : "false"}
              className="bg-input/80 placeholder:text-muted-foreground/60 border-border/80 focus:border-primary focus:ring-primary/50 transition-colors duration-200"
            />
            {form.formState.errors.department && <p className="text-xs text-destructive pt-1">{form.formState.errors.department.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="block" className="text-foreground/90 font-medium text-sm">Block / Location *</Label>
            <Input 
              id="block" 
              {...form.register("block")} 
              placeholder="e.g., A-Block, Canteen" 
              aria-invalid={form.formState.errors.block ? "true" : "false"}
              className="bg-input/80 placeholder:text-muted-foreground/60 border-border/80 focus:border-primary focus:ring-primary/50 transition-colors duration-200"
            />
            {form.formState.errors.block && <p className="text-xs text-destructive pt-1">{form.formState.errors.block.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="roomNo" className="text-foreground/90 font-medium text-sm">Room No. (Optional)</Label>
            <Input 
              id="roomNo" 
              {...form.register("roomNo")} 
              placeholder="e.g., 101, Lab 3" 
              aria-invalid={form.formState.errors.roomNo ? "true" : "false"}
              className="bg-input/80 placeholder:text-muted-foreground/60 border-border/80 focus:border-primary focus:ring-primary/50 transition-colors duration-200"
            />
            {form.formState.errors.roomNo && <p className="text-xs text-destructive pt-1">{form.formState.errors.roomNo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue" className="text-foreground/90 font-medium text-sm">Issue Description *</Label>
            <Textarea 
              id="issue" 
              {...form.register("issue")} 
              placeholder="Describe the issue in detail" 
              className="min-h-[100px] md:min-h-[120px] bg-input/80 placeholder:text-muted-foreground/60 border-border/80 focus:border-primary focus:ring-primary/50 transition-colors duration-200"
              aria-invalid={form.formState.errors.issue ? "true" : "false"}
            />
            {form.formState.errors.issue && <p className="text-xs text-destructive pt-1">{form.formState.errors.issue.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment" className="text-foreground/90 font-medium text-sm">Comment (Optional)</Label>
            <Textarea 
              id="comment" 
              {...form.register("comment")} 
              placeholder="Add any additional comments here" 
              className="min-h-[80px] md:min-h-[100px] bg-input/80 placeholder:text-muted-foreground/60 border-border/80 focus:border-primary focus:ring-primary/50 transition-colors duration-200"
              aria-invalid={form.formState.errors.comment ? "true" : "false"}
            />
            {form.formState.errors.comment && <p className="text-xs text-destructive pt-1">{form.formState.errors.comment.message}</p>}
          </div>
           {state.errors?.server && !state.success && ( // Only show server error if submission wasn't successful
            <p className="text-sm text-destructive pt-1">{state.errors.server.join(', ')}</p>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-5">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
