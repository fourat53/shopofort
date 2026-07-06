"use server";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";

async function createCartItem(formData: FormData) {
  const quantity = Number(formData.get("quantity"));
  const unitPrice = Number(formData.get("unitPrice"));
  const totalPrice = Number(formData.get("totalPrice"));
  const cartId = Number(formData.get("cartId"));
  const productId = Number(formData.get("productId"));

  await prisma.cartItem.create({
    data: { quantity, unitPrice, totalPrice, cartId, productId },
  });

  updateTag("cart-items");
}

export { createCartItem };
