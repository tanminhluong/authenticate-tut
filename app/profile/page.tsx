import { getServerSession } from "next-auth";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(options);
  const user = session?.user;

  if (!session || !session.user) redirect("/signin");
  return (
    <div>
      <Image
        src={user?.image ?? ""}
        alt={user?.firstName ?? ""}
        width={300}
        height={300}
        className="rounded-full"
      />
      <div className="grid grid-cols-4 gap-y-4">
        <p>First Name:</p> <p className="col-span-3">{user?.firstName}</p>
        <p>Last Name:</p> <p className="col-span-3">{user?.lastName}</p>
        <p>Phone:</p> <p className="col-span-3">{user?.phone}</p>
        <p>Email:</p> <p className="col-span-3">{user?.email}</p>
      </div>
    </div>
  );
}
