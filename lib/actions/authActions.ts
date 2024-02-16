"use server";

import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../prisma";
import sendMail, { compileTemplate } from "../mail";
import { signJWT, verifyJWT } from "../jwt";
import { activationTemplate } from "../email-templates/activation";
import { forgotPasswordTemplate } from "../email-templates/forgotPassword";

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
  const body = compileTemplate(
    result.firstName,
    activationUrl,
    activationTemplate,
  );
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

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new Error("The User Does Not Exist!");

  const jwtUserId = signJWT({ id: user.id });
  const resetPassUrl = `${process.env.NEXTAUTH_URL}/reset-password/${jwtUserId}`;
  const body = compileTemplate(
    user.lastName,
    resetPassUrl,
    forgotPasswordTemplate,
  );

  const sendResult = await sendMail({
    to: user.email,
    subject: "Reset Password",
    body: body,
  });

  return sendResult;
}

type ResetPasswordFunc = (
  jwtUserId: string,
  password: string,
) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFunc = async (jwtUserId, password) => {
  const payload = verifyJWT(jwtUserId);
  if (!payload) return "userNotExist";

  const userId = payload.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });

  if (result) return "success";
  else throw new Error("Something went wrong");
};
