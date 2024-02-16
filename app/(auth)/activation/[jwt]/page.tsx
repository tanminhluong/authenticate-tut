import { activateUser } from "@/lib/actions/authActions";
import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}

export default async function ActivationPage({ params }: Props) {
  const result = await activateUser(params.jwt);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {result === "userNotExist" ? (
        <p className="text-red-500 text-2xl">The user does not exist!</p>
      ) : result === "alreadyActivate" ? (
        <p className="text-red-500 text-2xl">
          Your account is already activated
        </p>
      ) : result === "success" ? (
        <p className="text-green-500 text-2xl">
          Success! Your account is now activated
        </p>
      ) : (
        <p className="text-yellow-500 text-2xl">Oops, something went wrong!</p>
      )}
    </div>
  );
}
