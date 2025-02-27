"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  ForgotPasswordSchema,
  TForgotPasswordFormType,
} from "@/utils/validator/authforms";
import {
  changePasswordAction,
  verifyOtp,
} from "@/lib/actions/auth/forgot-password";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./changePasswordForm";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { SendOTP_Server_Action } from "@/server/actions/auth/SendOTP.serverAction";
import { verify_OTP_Server_Action } from "@/server/actions/auth/verifyOTP.serverAction";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [passwordMode, setPasswordMode] = useState(false);
  const router = useRouter();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null
  );

  const form = useForm<TForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "", otp: "otpput" },
    mode: "onChange",
  });

  useEffect(() => {
    if (otpSent && timeLeft > 0) {
      const newTimer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setTimer(newTimer);

      return () => clearInterval(newTimer);
    } else if (timeLeft === 0 && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [otpSent, timeLeft]);

  const onSubmit = (data: TForgotPasswordFormType) => {
    if (otpSent) {
      verifyOtpFromForm(data);
    } else {
      sendOtp({ email: data.email });
    }
  };

  // Function to send OTP
  const sendOtp = async (data: Pick<TForgotPasswordFormType, "email">) => {
    console.log("clicked");
    setLoading(true);

    await SendOTP_Server_Action(data)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          form.setValue("otp", "");
          setOtpSent(true);

          setTimeLeft(30);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle OTP verification
  const verifyOtpFromForm = async (data: TForgotPasswordFormType) => {
    setLoading(true);
    await verify_OTP_Server_Action(data)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          setLoading(false);
          setPasswordMode(true);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        toast.error("Failed to verify OTP.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return passwordMode ? (
    <ChangePasswordForm
      serverAction={changePasswordAction}
      email={form.getValues("email")}
    />
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md min-w-md mx-auto"
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">Email</label>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OTP Field (Visible after OTP is sent) */}
        {otpSent && (
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <label className="block text-sm font-medium">Enter OTP</label>
                <FormControl>
                  {/* <Input {...field} type="password" placeholder="Enter OTP" /> */}
                  <div className="flex w-full justify-center items-center">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
        </Button>

        {/* Resend OTP Button */}
        {otpSent && (
          <Button
            type="button"
            variant="link"
            className="w-full text-blue-500 text-sm"
            onClick={() => sendOtp({ email: form.getValues("email") })}
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
          </Button>
        )}
      </form>
    </Form>
  );
}
