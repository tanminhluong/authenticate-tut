// "use client";

// import PasswordStrength from "@/app/(auth)/signup/_components/PasswordStrength";
// import { resetPassword } from "@/lib/actions/authActions";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button, Input } from "@nextui-org/react";
// import { passwordStrength } from "check-password-strength";
// import { useEffect, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { z } from "zod";

// interface Props {
//   jwtUserId: string;
// }

// const FormSchema = z
//   .object({
//     newPassword: z
//       .string()
//       .min(6, "Password must be at least 6 characters")
//       .max(50, "Password must be less than 50 characters"),
//     confirmNewPassword: z.string(),
//   })
//   .refine((data) => data.newPassword === data.confirmNewPassword, {
//     message: "Password does not match!",
//     path: ["confirmNewPassword"],
//   });

// type FormData = z.infer<typeof FormSchema>;

// export default function ResetPasswordForm({ jwtUserId }: Props) {
//   const [visiblePassword, setVisiblePassword] = useState(false);
//   const [passStrength, setPassStrength] = useState(0);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     resolver: zodResolver(FormSchema),
//   });

//   useEffect(() => {
//     setPassStrength(passwordStrength(watch().newPassword).id);
//   }, [watch]);

//   const onSubmit: SubmitHandler<FormData> = async (data) => {
//     try {
//       const result = await resetPassword(jwtUserId, data.newPassword);
//       if (result === "success")
//         toast.success("Your password has been reset successfully!");
//     } catch (err) {
//       toast.error("Something went wrong!");
//       console.error(err);
//     }
//   };

//   return (
//     <form
//       onClick={handleSubmit(onSubmit)}
//       className="flex flex-col gap-2 p-2 m-2 border rounded-md shadow"
//     >
//       <div className="text-center p-2">Reset Password</div>
//       <Input
//         label="New Password"
//         type={visiblePassword ? "text" : "password"}
//         {...register("newPassword")}
//         errorMessage={errors.newPassword?.message}
//         endContent={
//           <button
//             type="button"
//             onClick={() => setVisiblePassword((prev) => !prev)}
//           >
//             {visiblePassword ? (
//               <EyeSlashIcon className="w-4" />
//             ) : (
//               <EyeIcon className="w-4" />
//             )}
//           </button>
//         }
//       />
//       <div className="col-span-2">
//         <PasswordStrength passStrength={passStrength} />
//       </div>
//       <Input
//         label="Confirm New Password"
//         type={visiblePassword ? "text" : "password"}
//         {...register("confirmNewPassword")}
//         errorMessage={errors.confirmNewPassword?.message}
//       />
//       <div className="flex justify-center">
//         <Button
//           isLoading={isSubmitting}
//           type="submit"
//           disabled={isSubmitting}
//           color="primary"
//         >
//           {isSubmitting ? "Please Wait..." : "Submit"}
//         </Button>
//       </div>
//     </form>
//   );
// }

"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { passwordStrength } from "check-password-strength";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "@/lib/actions/authActions";
import { toast } from "react-toastify";
import PasswordStrength from "@/app/(auth)/signup/_components/PasswordStrength";

interface Props {
  jwtUserId: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters!")
      .max(52, "Password must be less than 52 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const ResetPasswordForm = ({ jwtUserId }: Props) => {
  const [visiblePass, setVisiblePass] = useState(false);
  const [passStrength, setPassStrength] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);

  const resetPass: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await resetPassword(jwtUserId, data.password);
      if (result === "success")
        toast.success("Your password has been reset successfully!");
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(resetPass)}
      className="flex flex-col gap-2 p-2 m-2 border rounded-md shadow"
    >
      <div className="text-center p-2">Reset Your Password</div>
      <Input
        type={visiblePass ? "text" : "password"}
        label="Password"
        {...register("password")}
        errorMessage={errors.password?.message}
        endContent={
          <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
            {visiblePass ? (
              <EyeSlashIcon className="w-4" />
            ) : (
              <EyeIcon className="w-4" />
            )}
          </button>
        }
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        type={visiblePass ? "text" : "password"}
        label="Confirm Password"
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
      />
      <div className="flex justify-center">
        <Button
          isLoading={isSubmitting}
          type="submit"
          disabled={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Please Wait..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
