
"use client";

import type * as React from 'react';
import { useEffect, useActionState, startTransition } from 'react'; 
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
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={pending} aria-disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
      issue: "",
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        });
        form.reset(); // Reset form on successful submission
      } else {
        toast({
          title: "Error",
          description: state.message || "Failed to submit complaint.",
          variant: "destructive",
        });
      }
    }
  }, [state, toast, form]);
  
  // Display field-specific errors from server validation
  useEffect(() => {
    if (state.errors) {
      const fieldErrors = state.errors;
      (Object.keys(fieldErrors) as Array<keyof ComplaintFormData>).forEach((key) => {
        if (fieldErrors[key] && fieldErrors[key]!.length > 0) {
          // @ts-ignore
          form.setError(key, { type: 'server', message: fieldErrors[key]![0] });
        }
      });
    }
  }, [state.errors, form]);


  return (
    <Card className="w-full shadow-xl border-2 border-primary/20 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">New Complaint</CardTitle>
        <CardDescription>Please fill out the details below. All fields are required.</CardDescription>
      </CardHeader>
      <form 
        action={formAction} 
        onSubmit={form.handleSubmit((_data, event) => {
          const formElement = event?.target as HTMLFormElement | undefined;
          if (formElement) {
            startTransition(() => {
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
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
            <Input 
              id="name" 
              {...form.register("name")} 
              placeholder="Enter your full name" 
              className="bg-card"
              aria-invalid={form.formState.errors.name ? "true" : "false"}
            />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-foreground/80">Department</Label>
            <Input 
              id="department" 
              {...form.register("department")} 
              placeholder="e.g., IT, HR, Maintenance" 
              className="bg-card"
              aria-invalid={form.formState.errors.department ? "true" : "false"}
            />
            {form.formState.errors.department && <p className="text-sm text-destructive">{form.formState.errors.department.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="block" className="text-foreground/80">Block / Location</Label>
            <Input 
              id="block" 
              {...form.register("block")} 
              placeholder="e.g., A-Block, Canteen, Room 101" 
              className="bg-card"
              aria-invalid={form.formState.errors.block ? "true" : "false"}
            />
            {form.formState.errors.block && <p className="text-sm text-destructive">{form.formState.errors.block.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue" className="text-foreground/80">Issue Description</Label>
            <Textarea 
              id="issue" 
              {...form.register("issue")} 
              placeholder="Describe the issue in detail" 
              className="min-h-[120px] bg-card"
              aria-invalid={form.formState.errors.issue ? "true" : "false"}
            />
            {form.formState.errors.issue && <p className="text-sm text-destructive">{form.formState.errors.issue.message}</p>}
          </div>
           {state.errors?.server && (
            <p className="text-sm text-destructive">{state.errors.server.join(', ')}</p>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
