"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Link } from "next-view-transitions";
import DUX from "../ui/Dux";
import {
  emailVerificationByToken,
  resendVerificationToken,
} from "@/lib/actions/auth/verify-token";
import { Button } from "../ui/button";
import { Email_Verification_Server_Action } from "@/server/actions/auth/emailVerificationToken.serverAction";

const VerifyEmailPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);


  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setError("No token provided");
      setIsLoading(false);
      return;
    }

    try {
      const res = await Email_Verification_Server_Action(token);

      if (res.success) {
        setSuccess(res.message);
        setError(undefined);
      } else {
        setError(res.message);
        // if (res.message === "Token has expired") {

        //   await resendVerificationToken(email);
        //   setError("Token expired. A new verification email has been sent.");
        // }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          {" "}
          <DUX />
        </div>
      </motion.div>

      <Card className="w-full max-w-md shadow-lg p-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin " />
              <p className="mt-2">Verifying your email...</p>
            </div>
          ) : success ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-green-600"
            >
              <CheckCircle className="w-10 h-10" />
              <p className="mt-2 font-semibold">{success}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-red-600"
            >
              <XCircle className="w-10 h-10" />
              <p className="mt-2 font-semibold">{error}</p>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-600 underline">
              <Button variant="outline" className="w-fit">
                Go to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
