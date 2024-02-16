import { verifyJWT } from "@/lib/jwt";
import ResetPasswordForm from "./_components/ResetPasswordForm";

interface Props {
  params: {
    jwt: string;
  };
}

export default function ResetPasswordPage({ params }: Props) {
  const payload = verifyJWT(params.jwt);
  if (!payload) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl">
        This URL is not valid
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
}
