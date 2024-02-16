import React from "react";
import SignInForm from "./_components/SignInForm";
import Link from "next/link";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function SignInPage({ searchParams }: Props) {
  console.log(searchParams);

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-2">
      <SignInForm callbackUrl={searchParams.callbackUrl} />
      <div className="flex flex-col gap-2">
        <Link href={`/forgot-password`}>Forgot your password?</Link>
        <p>
          New to this site?{" "}
          <Link
            href={`/signup`}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
