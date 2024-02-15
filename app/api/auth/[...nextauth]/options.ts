import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

export const options: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "User Name:",
          type: "text",
          placeholder: "Your User Name",
        },
        password: { label: "Password:", type: "password" },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) throw new Error("Email or password is incorrect!");

        if (!credentials?.password)
          throw new Error("Please enter your password!");
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect)
          throw new Error("Email or password is incorrect! ");

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
};
