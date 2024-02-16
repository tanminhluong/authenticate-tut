"use client";

import { forgotPassword } from "@/lib/actions/authActions";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof FormSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const result = await forgotPassword(data.email);

      if (result) toast.success("Reset password link was sent to your email.");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center">
      <form
        className="flex flex-col gap-2 p-2 m-2 border rounded-md shadow "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-center p-2">Enter your Email</div>
        <Input
          label="Email"
          {...register("email")}
          startContent={<EnvelopeIcon className="w-4" />}
          errorMessage={errors.email?.message}
        />
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting}
          color="primary"
          type="submit"
        >
          {isSubmitting ? "Please wait..." : "Submit"}
        </Button>
      </form>
      <Image
        src={"/forgotPass.png"}
        alt="forgot password"
        title="forgot password"
        width={500}
        height={500}
        className="col-span-2 place-self-center"
      />
    </div>
  );
}
