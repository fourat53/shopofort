"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

async function createOrderItem(formData: FormData) {
  const quantity = Number(formData.get("quantity"));
  const price = Number(formData.get("price"));
  const orderId = Number(formData.get("orderId"));
  const productId = Number(formData.get("productId"));

  await prisma.orderItem.create({
    data: { quantity, price, orderId, productId },
  });

  // @ts-expect-error - prisma tag
  revalidateTag("order-items");
}

export { createOrderItem };
