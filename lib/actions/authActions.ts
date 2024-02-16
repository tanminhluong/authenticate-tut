"use server";

import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../prisma";
import sendMail, { compileActivationTemple } from "../mail";
import { signJWT, verifyJWT } from "../jwt";

export async function registerUser(
  user: Omit<User, "id" | "emailVerified" | "image">,
) {
  const result = await prisma.user.create({
    data: {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    },
  });

  const jwtUserId = signJWT({ id: result.id });
  const activationUrl = `${process.env.NEXTAUTH_URL}/activation/${jwtUserId}`;
  const body = compileActivationTemple(result.firstName, activationUrl);
  await sendMail({ to: result.email, subject: "Activate your account", body });
  return result;
}

type ActivateUserFunc = (
  jwtUserId: string,
) => Promise<"userNotExist" | "alreadyActivate" | "success">;

export const activateUser: ActivateUserFunc = async (jwtUserId) => {
  const payload = verifyJWT(jwtUserId);
  const userId = payload?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";
  if (user.emailVerified) return "alreadyActivate";

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return "success";
};
