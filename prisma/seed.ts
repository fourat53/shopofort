import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { getUsers } from "@/actions/UserActions";
import {
	audiences,
	brands,
	categoryNames,
	orderStatuses,
	productColors,
	productImages,
	productNames,
	productSizes,
	randomFloat,
	randomInt,
	randomList,
} from "@/lib/entity/data";
import type { ProductColor, ProductSize } from "@/lib/entity/types";
import { checkedEnvVar } from "@/lib/env";
import { PrismaClient } from "@/prisma/generated/prisma/client";

config();

const adapter = new PrismaPg({
	connectionString: checkedEnvVar("DATABASE_URL"),
});

const prisma = new PrismaClient({ adapter });

async function clearDatabase() {
	await prisma.orderItem.deleteMany();
	await prisma.cartItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.cart.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();
	console.log("🗑️ Database cleared.");
}

async function main(minId: number, maxId: number) {
	console.log("🌱 Starting seed...\n");

	console.log("📂 Seeding Categories...");
	const categories = [];
	for (const name of categoryNames) {
		for (const audience of audiences) {
			if (audience === "Men" && ["Skirts", "Dresses"].includes(name)) {
				continue;
			}
			categories.push({ name, audience });
		}
	}

	await prisma.category.createMany({
		data: categories,
	});

	console.log("📦 Seeding Products...");
	const dbCategories = await prisma.category.findMany();
	const products = [];
	for (let i = minId; i <= maxId * 2; i++) {
		products.push({
			name: productNames[i % productNames.length],
			brand: brands[i % brands.length],
			price: randomFloat(20, 200),
			inventory: randomInt(0, 100),
			description: `High quality ${productNames[i % productNames.length].toLowerCase()} for everyday wear.`,
			colors: randomList<ProductColor>(productColors),
			sizes: randomList<ProductSize>(productSizes),
			categoryId: dbCategories[i % dbCategories.length].id,
			images: randomList<string>(productImages),
		});
	}
	await prisma.product.createMany({
		data: products,
	});

	const dbProducts = await prisma.product.findMany();
	const dbUsers = await getUsers();

	if (dbUsers.length > 0) {
		console.log("🛒 Seeding Carts...");
		const carts = [];
		for (let i = 0; i < dbUsers.length; i++) {
			carts.push({
				userId: dbUsers[i].id,
				totalPrice: 0,
			});
		}
		await prisma.cart.createMany({
			data: carts,
		});

		console.log("🛍️ Seeding Cart Items...");
		const dbCarts = await prisma.cart.findMany();
		const cartItems = [];
		for (let i = minId; i < (maxId * 3) / 2; i++) {
			const randomProduct =
				dbProducts[Math.floor(Math.random() * dbProducts.length)];
			cartItems.push({
				cartId: dbCarts[i % dbCarts.length].id,
				productId: randomProduct.id,
				quantity: randomInt(1, 15),
				color:
					randomProduct.colors[
						Math.floor(Math.random() * randomProduct.colors.length)
					],
				size: randomProduct.sizes[
					Math.floor(Math.random() * randomProduct.sizes.length)
				],
			});
		}
		await prisma.cartItem.createMany({
			data: cartItems,
		});

		console.log("🛒 Updating Cart Total Prices...");
		for (const cart of dbCarts) {
			const cartItems = await prisma.cartItem.findMany({
				where: { cartId: cart.id },
				select: {
					product: true,
					quantity: true,
				},
			});
			const totalPrice = cartItems.reduce(
				(sum, item) => sum + Number(item.product.price) * item.quantity,
				0,
			);
			await prisma.cart.update({
				where: { id: cart.id },
				data: { totalPrice },
			});
		}

		console.log("📦 Seeding Orders...");
		const orders = [];
		for (let i = minId; i < maxId / 2; i++) {
			const randomUser = dbUsers[i % dbUsers.length];
			orders.push({
				userId: randomUser.id,
				orderDate: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000),
				),
				totalPrice: 0,
				orderStatus: orderStatuses[randomInt(0, orderStatuses.length - 1)],
			});
		}
		await prisma.order.createMany({
			data: orders,
		});

		console.log("🧾 Seeding Order Items...");
		const dbOrders = await prisma.order.findMany();
		const orderItems = [];
		for (let i = minId; i < maxId * 2; i++) {
			const randomProduct =
				dbProducts[Math.floor(Math.random() * dbProducts.length)];
			const randomOrder = dbOrders[i % dbOrders.length];
			orderItems.push({
				orderId: randomOrder.id,
				productId: randomProduct.id,
				quantity: randomInt(1, 15),
				color:
					randomProduct.colors[
						Math.floor(Math.random() * randomProduct.colors.length)
					],
				size: randomProduct.sizes[
					Math.floor(Math.random() * randomProduct.sizes.length)
				],
			});
		}
		await prisma.orderItem.createMany({
			data: orderItems,
		});

		console.log("📦 Updating Order Total Prices...");
		for (const order of dbOrders) {
			const orderItems = await prisma.orderItem.findMany({
				where: { orderId: order.id },
				select: {
					product: true,
					quantity: true,
				},
			});
			const totalPrice = orderItems.reduce(
				(sum, item) => sum + Number(item.product.price) * item.quantity,
				0,
			);
			await prisma.order.update({
				where: { id: order.id },
				data: { totalPrice },
			});
		}
	} else {
		console.log("ℹ️  No users were available from Kinde.");
	}

	console.log("\n✅ Seed finished successfully!");
}

(async () => {
	try {
		await clearDatabase();
		await main(0, 16);
	} catch (e) {
		console.error(e);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
})();

export { clearDatabase, main };
