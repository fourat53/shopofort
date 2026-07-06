"use server";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";

async function createImage(formData: FormData) {
  const fileName = formData.get("fileName") as string;
  const fileType = formData.get("fileType") as string;
  const downloadUrl = formData.get("downloadUrl") as string;
  const productId = Number(formData.get("productId"));

  await prisma.image.create({
    data: { fileName, fileType, downloadUrl, productId },
  });

  updateTag("images");
}

export { createImage };
