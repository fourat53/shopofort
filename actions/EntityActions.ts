"use server";

import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";
import type {
  User,
  Product,
  Order,
  Cart,
  Category,
  CartItem,
  OrderItem,
} from "@/lib/generated/prisma/client";

type DataType = User | Product | Order | Cart | Category | CartItem | OrderItem;

const tagMap: Record<string, string> = {
  user: "users",
  product: "products",
  order: "orders",
  cart: "carts",
  category: "categories",
  cartItem: "cart-items",
  orderItem: "order-items",
};

async function getEntityById(modelName: string, id: number) {
  try {
    // @ts-expect-error - prisma dynamic model access
    const data = await prisma[modelName].findUnique({ where: { id } });
    if (!data) return null;
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function deleteEntity(modelName: string, id: number) {
  try {
    // @ts-expect-error - prisma dynamic model access
    await prisma[modelName].delete({ where: { id } });

    const tag = tagMap[modelName];
    if (tag) {
            updateTag(tag);
    }
  } catch (error) {
    console.error(error);
  }
}

async function createEntity(modelName: string, data: DataType) {
  try {
    // @ts-expect-error - prisma dynamic model access
    await prisma[modelName].create({ data });

    const tag = tagMap[modelName];
    if (tag) {
            updateTag(tag);
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateEntity(modelName: string, id: number, data: DataType) {
  try {
    // @ts-expect-error - prisma dynamic model access
    await prisma[modelName].update({ where: { id }, data });

    const tag = tagMap[modelName];
    if (tag) {
            updateTag(tag);
    }
  } catch (error) {
    console.error(error);
  }
}

export { getEntityById, deleteEntity, createEntity, updateEntity };
