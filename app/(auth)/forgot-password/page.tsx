import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
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

  const onSubmit = () => {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        >
          {isSubmitting ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
