import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { getUsers } from "@/actions/UserActions";
import { Audience, OrderStatus } from "@/lib/entity/types";
import { checkedEnvVar } from "@/lib/env";
import { PrismaClient } from "@/prisma/generated/prisma/client";

config();

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

const randomImages = (productImages: string[], max = 6) => {
	const count = randomInt(0, Math.min(max, productImages.length));
	return [...productImages].sort(() => Math.random() - 0.5).slice(0, count);
};

const categoryNames: string[] = [
	"T-Shirts",
	"Hoodies",
	"Trousers",
	"Shorts",
	"Skirts",
	"Dresses",
	"Jackets",
	"Coats",
	// "Shoes",
	// "Underwear",
	// "Socks",
	// "Bags",
	// "Hats",
	// "Scarves",
	// "Gloves",
	// "Belts",
];
const productNames: string[] = [
	"Classic Cotton T-Shirt",
	"Slim Fit Denim Jeans",
	"Cozy Fleece Hoodie",
	"Summer Flowy Dress",
	"Leather Biker Jacket",
	"Comfortable Sweatpants",
	"Formal Oxford Shirt",
	"Casual Chino Shorts",
];
const brands: string[] = ["Nike", "Adidas", "Puma", "Zara", "H&M"];
const productImages: string[] = [
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1dSEnXS38UzQDyw3pbxj5NER2dfKCqAiaeTZ4",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1HY2IgAjCr8OP1s6Zek2MxtBjz7J3gWafYvGm",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1OZpUAhisj0Kx9E3cfUeqJPzawNtp1i7Arldn",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1qiBUq5TdePjMhgUx0NG7CZ2QmW6cwVutXrB4",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1r8FbS36VaZTILwc0PQ58hAjNdqBisDmKEobR",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1gF95NvCCknIPeJzQ85qvUb16dfEiKtjhFTDZ",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1K8JmFgqXz6dZfUoSWynaNQ13kGwrcsxRB0ep",
	"https://w1jla568cs.ufs.sh/f/jOZEJ62sgvo1eMvNvYetLGXQlqnsWAfVUD4icET8mZxkOBJa",
];
const orderStatuses = Object.values(OrderStatus);

async function main(minId: number, maxId: number) {
	console.log("🌱 Starting seed...\n");

	console.log("📂 Seeding Categories...");
	const categories = [];
	for (const name of categoryNames)
		for (const audience of Object.values(Audience))
			categories.push({ name, audience });

	await prisma.category.createMany({
		data: categories,
	});

	console.log("📦 Seeding Products...");
	const dbCategories = await prisma.category.findMany();
	const products = [];
	for (let i = minId; i <= maxId; i++) {
		products.push({
			name: productNames[i % productNames.length],
			brand: brands[i % brands.length],
			price: randomPrice(),
			inventory: Math.floor(Math.random() * 100),
			description: `High quality ${productNames[i % productNames.length].toLowerCase()} for everyday wear.`,
			categoryId: dbCategories[i % dbCategories.length].id,
			images: randomImages(productImages),
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
		for (let i = minId; i < maxId; i++) {
			const randomUser = dbUsers[i % dbUsers.length];
			orders.push({
				userId: randomUser.id,
				orderDate: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000),
				),
				totalAmount: randomPrice(),
				orderStatus: orderStatuses[i % orderStatuses.length],
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
	} else {
		console.log(
			"ℹ️  No users were available from Kinde, so carts, cart items, orders and orders items were skipped.",
		);
	}

	console.log("\n✅ Seed finished successfully!");
}

async function clearDatabase() {
	await prisma.orderItem.deleteMany();
	await prisma.cartItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.cart.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();
	console.log("🗑️ Database cleared.");
}

(async () => {
	try {
		await clearDatabase();
		await main(1, 99);
	} catch (e) {
		console.error(e);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
})();

export { clearDatabase, main };
