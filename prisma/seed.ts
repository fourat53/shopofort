import { PrismaClient, Role } from "@/lib/generated/prisma/client";
import { checkedEnvVar } from "@/lib/checked-env-var";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const productImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", // T-Shirt
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80", // T-shirt
  "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?auto=format&fit=crop&w=800&q=80", // Sweatshirt
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", //    Hoodie
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80", // Trousers
  "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80", //    Jeans
  "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80", // Shorts
  "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80", // Hat
] as const;

const adapter = new PrismaPg({
  connectionString: checkedEnvVar("DATABASE_URL"),
});

const prisma = new PrismaClient({ adapter });

const randomPrice = () => {
  return parseFloat((Math.random() * 100 + 10).toFixed(2));
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.image.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function main(minId: number, maxId: number) {
  await clearDatabase();
  console.log("🌱 Starting seed...");
  console.log("📂 Seeding Categories...");
  const categories = [];
  const genders: ("MALE" | "FEMALE")[] = ["MALE", "FEMALE"];

  for (let i = minId; i <= maxId; i++) {
    categories.push({
      name: `Category ${i}`,
      gender: genders[i % 2],
    });
  }
  await prisma.category.createMany({
    data: categories,
  });

  console.log("👤 Seeding Users...");
  const users = [];
  for (let i = minId; i <= maxId; i++) {
    users.push({
      firstName: `User${i}`,
      lastName: `Lastname${i}`,
      email: `user${i}@example.com`,
      role: i === 0 ? Role.ADMIN : Role.USER,
    });
  }
  await prisma.user.createMany({
    data: users,
  });

  console.log("📦 Seeding Products...");
  const dbCategories = await prisma.category.findMany();
  const products = [];

  for (let i = minId; i <= maxId; i++) {
    products.push({
      name: `Product ${i}`,
      brand: `Brand ${i % 5}`,
      price: randomPrice(),
      inventory: Math.floor(Math.random() * 100),
      description: `Description for product ${i}`,
      categoryId: dbCategories[i % dbCategories.length].id,
    });
  }
  await prisma.product.createMany({
    data: products,
  });

  console.log("🖼️ Seeding Images...");
  const dbProducts = await prisma.product.findMany();
  const images = [];

  for (let i = minId; i <= maxId; i++) {
    const selectedImageUrl = productImages[i % productImages.length];

    images.push({
      fileName: `product-image-${i}.jpg`,
      fileType: "image/jpeg",
      downloadUrl: selectedImageUrl,
      productId: dbProducts[i % dbProducts.length].id,
    });
  }
  await prisma.image.createMany({
    data: images,
  });

  console.log("🛒 Seeding Carts...");
  const dbUsers = await prisma.user.findMany();
  const carts = [];

  for (let i = 0; i < dbUsers.length; i++) {
    carts.push({
      userId: dbUsers[i].id,
      totalAmount: randomInt(1, 15),
    });
  }
  await prisma.cart.createMany({
    data: carts,
  });

  console.log("🛍️ Seeding Cart Items...");
  const dbCarts = await prisma.cart.findMany();
  const cartItems = [];

  for (let i = minId; i < maxId; i++) {
    const randomProduct =
      dbProducts[Math.floor(Math.random() * dbProducts.length)];
    const randomCart = dbCarts[i % dbCarts.length];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = randomProduct.price;

    cartItems.push({
      cartId: randomCart.id,
      productId: randomProduct.id,
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: Number(unitPrice) * quantity,
    });
  }
  await prisma.cartItem.createMany({
    data: cartItems,
  });

  console.log("📦 Seeding Orders...");
  const orders = [];
  const statuses: (
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
  )[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  for (let i = minId; i < maxId; i++) {
    const randomUser = dbUsers[i % dbUsers.length];
    orders.push({
      userId: randomUser.id,
      orderDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      totalAmount: randomPrice(),
      orderStatus: statuses[i % statuses.length],
    });
  }
  await prisma.order.createMany({
    data: orders,
  });

  console.log("🧾 Seeding Order Items...");
  const dbOrders = await prisma.order.findMany();
  const orderItems = [];

  for (let i = minId; i < maxId; i++) {
    const randomProduct =
      dbProducts[Math.floor(Math.random() * dbProducts.length)];
    const randomOrder = dbOrders[i % dbOrders.length];

    orderItems.push({
      orderId: randomOrder.id,
      productId: randomProduct.id,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: randomProduct.price,
    });
  }
  await prisma.orderItem.createMany({
    data: orderItems,
  });

  console.log("✅ Seed finished successfully!");
}

(async () => {
  try {
    await main(51, 100);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

export { clearDatabase, main };
