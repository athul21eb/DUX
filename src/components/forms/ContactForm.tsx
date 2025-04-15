"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "../shared/cardWrapper";
import { SubmitButton } from "../ui/submitButton";
import {
  ContactFormSchema,
  TContactFormInputType,
} from "@/utils/validator/contact-form";
import { Contact_Form_Server_Action } from "@/server/actions/public/contact-form.server-action";

// Main contact form component
export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Initialize form with React Hook Form
  const form = useForm<TContactFormInputType>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      message: "",
    },
  });

  // Clean up toasts when component unmounts
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  // Form submission handler
  const onSubmit = async (data: TContactFormInputType) => {
    setLoading(true);
    setFormSuccess(false);
    console.log(data, "data in contact form");
    // Call the dummy server action
    Contact_Form_Server_Action(data).then((res) => {
      toast.dismiss();

      if (res.success) {
        setFormSuccess(true);
        form.reset();
        toast.success(res.message);
      } else {
        // In case of error (not in our dummy implementation but good to handle)
        toast.error(res.message || "Something went wrong", { duration: 5000 });
      }

      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <CardWrapper title="Contact Us" description="We'd love to hear from you">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Doe"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john.doe@example.com"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="How can we help you?"
                        className="min-h-[120px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SubmitButton
              loading={loading}
              buttonText="Submit"
              loadingText="Submitting..."
              onClick={() => setFormSuccess(false)}
            />
          </form>
        </Form>
      </CardWrapper>
      {formSuccess && (
        <Alert className="bg-green-500/20 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your message has been sent successfully. We'll get back to you soon.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
