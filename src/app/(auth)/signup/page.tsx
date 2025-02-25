import SignUpForm from "@/components/forms/SignUpForm";

function RegisterPage() {
  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-8">
      <div className="flex w-full max-w-md flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  );
}

export default RegisterPage;
