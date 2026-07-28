"use server";

import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

async function createUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const role = (formData.get("role") as Role) || "USER";

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      role,
    },
  });

  // @ts-expect-error - prisma tag
  revalidateTag("users");
}

async function getUsersOptions() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
    orderBy: { id: "asc" },
  });
  return users.map((u) => ({
    value: String(u.id),
    label: `${u.id} - ${u.email}`,
  }));
}

export { createUser, getUsersOptions };
