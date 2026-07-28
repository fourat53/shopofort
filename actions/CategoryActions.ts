"use server";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";

async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const gender = formData.get("gender") as any;

  await prisma.category.create({
    data: { name, gender },
  });

    updateTag("categories");
}

async function getCategoriesOptions() {
  const items = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });
  return items.map((item) => ({
    value: String(item.id),
    label: `${item.name}`,
  }));
}

export { createCategory, getCategoriesOptions };
