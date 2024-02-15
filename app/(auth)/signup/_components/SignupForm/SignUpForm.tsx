"use client";

import React, { useState } from "react";
import * as z from "zod";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import validator from "validator";
import { Controller, Form, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z
  .object({
    firstName: z
      .string({ required_error: "First Name is required" })
      .min(2, "First Name must be at least 2 characters")
      .max(45, "First Name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-z]+$"), "No special character allowed!"),
    lastName: z
      .string()
      .min(2, "Last Name must be at least 2 characters")
      .max(45, "Last Name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-z]+$"), "No special character allowed!"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please enter a valid phone number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match!",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof FormSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const toggleVisible = () => setIsVisiblePassword((prev) => !prev);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log({ data });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-3 p-3 place-self-stretch border shadow rounded-md"
    >
      <Input
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        {...register("firstName")}
        label="First Name"
        startContent={<UserIcon className="w-4 h-4" />}
      />
      <Input
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        {...register("lastName")}
        label="Last Name"
        startContent={<UserIcon className="w-4 h-4" />}
      />
      <Input
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        {...register("email")}
        className="col-span-2"
        label="Email"
        startContent={<EnvelopeIcon className="w-4 h-4" />}
      />
      <Input
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        {...register("phone")}
        className="col-span-2"
        label="Phone"
        startContent={<PhoneIcon className="w-4 h-4" />}
      />
      <Input
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        {...register("password")}
        className="col-span-2"
        label="Password"
        type={isVisiblePassword ? "Text" : "Password"}
        startContent={<KeyIcon className="w-4 h-4" />}
        endContent={
          isVisiblePassword ? (
            <EyeSlashIcon
              className="w-4 h-4 cursor-pointer"
              onClick={toggleVisible}
            />
          ) : (
            <EyeIcon
              className="w-4 h-4 cursor-pointer"
              onClick={toggleVisible}
            />
          )
        }
      />
      <Input
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        {...register("confirmPassword")}
        className="col-span-2"
        label="Confirm password"
        type={isVisiblePassword ? "Text" : "Password"}
        startContent={<KeyIcon className="w-4 h-4" />}
      />
      <Controller
        name="accepted"
        control={control}
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            className="col-span-2"
          >
            I Accept The <Link href="/terms">Terms</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className="text-red-500">{errors.accepted.message}</p>
      )}
      <div className="col-span-2 flex justify-center">
        <Button className="w-48" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}
