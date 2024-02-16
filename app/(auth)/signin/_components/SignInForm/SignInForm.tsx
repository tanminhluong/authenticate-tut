"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface Props {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address!"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function SignInForm({ callbackUrl }: Props) {
  const router = useRouter();
  const [visiblePassword, setVisiblePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!result?.ok) {
      toast.error(result?.error);
      return;
    }

    toast.success(`Welcome to Dashboard`);
    router.push(callbackUrl ? callbackUrl : "/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 border rounded-md shadow overflow-hidden w-[30%]"
    >
      <div className="bg-gradient-to-b from-white to-slate-200 dark:from-slate-700 dark:to-slate-900 p-2 text-center">
        Sign In Form
      </div>
      <div className="p-2 flex flex-col gap-2">
        <Input
          label="Email"
          {...register("email")}
          errorMessage={errors.email?.message}
        />
        <Input
          label="Password"
          type={visiblePassword ? "text" : "password"}
          {...register("password")}
          errorMessage={errors.password?.message}
          endContent={
            <button
              type="button"
              onClick={() => setVisiblePassword((prev) => !prev)}
            >
              {visiblePassword ? (
                <EyeSlashIcon className="w-4" />
              ) : (
                <EyeIcon className="w-4" />
              )}
            </button>
          }
        />
        <div className="flex items-center justify-center">
          <Button
            disabled={isSubmitting}
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            className="w-32"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </div>
    </form>
  );
}
