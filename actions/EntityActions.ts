"use server";

import { prisma } from "@/lib/prisma";

export async function getEntityById(modelName: string, id: number) {
  try {
    // @ts-expect-error - prisma dynamic model access
    const data = await prisma[modelName].findUnique({
      where: { id },
    });
    if (!data) return null;
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return null;
  }
}
