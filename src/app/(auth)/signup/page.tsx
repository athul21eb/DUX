import SignUpForm from "@/components/forms/SignUpForm";
import { signOut } from "@/lib/auth/auth";


async function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {


   const error =  (await searchParams).error

  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <SignUpForm sessionExpired={error === "session_expired"} />
      </div>
    </div>
  );
}

export default RegisterPage;
