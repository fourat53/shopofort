import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { checkedEnvVar } from "@/lib/checked-env-var";
import {
	type OrderStatus,
	PrismaClient,
	Role,
} from "@/lib/generated/prisma/client";
import type { UserCreateManyInput } from "@/lib/generated/prisma/models";

config({ path: checkedEnvVar("ENV_PATH") });
config();

type KindeUserPayload = {
	id?: string;
	provided_id?: string;
	email?: string | null;
	username?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	picture?: string | null;
	is_suspended?: boolean | null;
	total_sign_ins?: number | null;
	failed_sign_ins?: number | null;
	last_signed_in?: string | null;
	created_on?: string | null;
	organizations?: unknown;
	identities?: unknown;
};

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

async function fetchKindeUsers(): Promise<KindeUserPayload[]> {
	const issuerUrl = checkedEnvVar("KINDE_ISSUER_URL").replace(/\/$/, "");
	const tokenResponse = await fetch(`${issuerUrl}/oauth2/token`, {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "client_credentials",
			client_id: checkedEnvVar("KINDE_CLIENT_ID"),
			client_secret: checkedEnvVar("KINDE_CLIENT_SECRET"),
			audience: `${issuerUrl}/api`,
		}),
	});

	if (!tokenResponse.ok) {
		const errorText = await tokenResponse.text();
		throw new Error(
			`Kinde token request failed (${tokenResponse.status}): ${errorText}`,
		);
	}

	const tokenJson = (await tokenResponse.json()) as {
		access_token?: string;
		error?: string;
		error_description?: string;
	};

	if (!tokenJson.access_token) {
		throw new Error(
			`Kinde token response did not include an access token: ${tokenJson.error_description ?? tokenJson.error ?? "unknown error"}`,
		);
	}

	const usersResponse = await fetch(`${issuerUrl}/api/v1/users`, {
		headers: {
			Authorization: `Bearer ${tokenJson.access_token}`,
			Accept: "application/json",
		},
	});

	if (!usersResponse.ok) {
		const errorText = await usersResponse.text();
		throw new Error(
			`Kinde users request failed (${usersResponse.status}): ${errorText}`,
		);
	}

	const usersPayload = (await usersResponse.json()) as {
		users?: KindeUserPayload[];
		message?: string;
		code?: string;
	};

	return usersPayload.users ?? [];
}

function normalizeKindeUser(user: KindeUserPayload) {
	const firstName = user.first_name ?? null;
	const lastName = user.last_name ?? null;

	return {
		kindeId: user.id ?? user.provided_id ?? null,
		providedId: user.provided_id ?? null,
		firstName,
		lastName,
		givenName: firstName,
		familyName: lastName,
		username: user.username ?? null,
		email:
			user.email ??
			`${user.provided_id ?? user.id ?? "kinde-user"}@kinde.local`,
		emailVerified: false,
		picture: user.picture ?? null,
		role: Role.USER,
		isSuspended: Boolean(user.is_suspended),
		totalSignIns:
			typeof user.total_sign_ins === "number" ? user.total_sign_ins : null,
		failedSignIns:
			typeof user.failed_sign_ins === "number" ? user.failed_sign_ins : null,
		lastSignedIn: user.last_signed_in ? new Date(user.last_signed_in) : null,
		createdOn: user.created_on ? new Date(user.created_on) : null,
		organizations: user.organizations ?? null,
		identities: user.identities ?? null,
	};
}

async function clearDatabase() {
	await prisma.orderItem.deleteMany();
	await prisma.cartItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.cart.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();
	await prisma.user.deleteMany();
}

const categoryNames = ["T-Shirts", "Jeans", "Hoodies", "Dresses", "Jackets"];
const genders: ("MALE" | "FEMALE")[] = ["MALE", "FEMALE"];
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
	"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80",
];
const statuses: OrderStatus[] = [
	"PENDING",
	"PROCESSING",
	"SHIPPED",
	"DELIVERED",
	"CANCELLED",
];

async function main(minId: number, maxId: number) {
	await clearDatabase();
	console.log("🌱 Starting seed...");

	console.log("📂 Seeding Categories...");
	const categories = [];
	for (let i = minId; i <= maxId; i++) {
		categories.push({
			name: categoryNames[i % categoryNames.length],
			gender: genders[i % 2],
		});
	}
	await prisma.category.createMany({
		data: categories,
	});

	console.log("👤 Seeding Users...");
	let kindeUsers: KindeUserPayload[] = [];
	try {
		kindeUsers = (await fetchKindeUsers()).map(normalizeKindeUser);
		console.log(`✅ Fetched ${kindeUsers.length} users from Kinde`);
	} catch (error) {
		console.error(
			"⚠️  Unable to fetch Kinde users, continuing with an empty user set.",
			error,
		);
	}
	if (kindeUsers.length > 0) {
		await prisma.user.createMany({
			data: kindeUsers as UserCreateManyInput[],
		});
	}

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
			images: productImages,
		});
	}
	await prisma.product.createMany({
		data: products,
	});

	const dbProducts = await prisma.product.findMany();
	const dbUsers = await prisma.user.findMany();

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
	} else {
		console.log(
			"ℹ️  No users were available from Kinde, so carts, cart items, orders and orders items were skipped.",
		);
	}

	console.log("✅ Seed finished successfully!");
}

(async () => {
	try {
		await main(1, 99);
	} catch (e) {
		console.error(e);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
})();
