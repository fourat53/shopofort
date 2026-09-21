"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

interface DashboardStats {
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number;
	pendingOrders: number;
}

interface TopRatedProduct {
	id: number;
	name: string;
	rating: number;
	votes: number;
	image?: string;
}

interface MostPurchasedProduct {
	id: number;
	name: string;
	totalQuantity: number;
	revenue: number;
	image?: string;
}

interface LowStockProduct {
	id: number;
	name: string;
	inventory: number;
	image?: string;
}

interface NeverPurchasedProduct {
	id: number;
	name: string;
	inventory: number;
	image?: string;
}

interface RevenueByMonth {
	month: string;
	revenue: number;
	orders: number;
}

interface OrdersByStatus {
	status: string;
	count: number;
}

interface TopCategory {
	id: number;
	name: string;
	productCount: number;
	totalRevenue: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
	const [totalProducts, totalOrders, totalRevenue, pendingOrders] =
		await Promise.all([
			prisma.product.count(),
			prisma.order.count(),
			prisma.order.aggregate({ _sum: { totalPrice: true } }),
			prisma.order.count({ where: { orderStatus: "PENDING" } }),
		]);

	return {
		totalProducts,
		totalOrders,
		totalRevenue: Number(totalRevenue._sum.totalPrice || 0),
		pendingOrders,
	};
}

async function getTopRatedProducts(limit = 5): Promise<TopRatedProduct[]> {
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				where: {
					votes: { gt: 0 },
				},
				orderBy: { rating: "desc" },
				take: limit,
				select: {
					id: true,
					name: true,
					rating: true,
					votes: true,
					images: true,
				},
			});
			return products.map((p) => ({
				...p,
				rating: Number(p.rating),
				image: p.images?.[0],
			}));
		},
		["dashboard-top-rated"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

async function getMostPurchasedProducts(
	limit = 5,
): Promise<MostPurchasedProduct[]> {
	return unstable_cache(
		async () => {
			const orderItems = await prisma.orderItem.groupBy({
				by: ["productId"],
				_sum: { quantity: true },
				_count: { id: true },
				orderBy: { _sum: { quantity: "desc" } },
				take: limit,
			});

			const productIds = orderItems.map((oi) => oi.productId);
			const products = await prisma.product.findMany({
				where: { id: { in: productIds } },
				select: { id: true, name: true, images: true, price: true },
			});

			return orderItems.map((oi) => {
				const product = products.find((p) => p.id === oi.productId);
				return {
					id: oi.productId,
					name: product?.name || "Unknown",
					totalQuantity: oi._sum.quantity || 0,
					revenue: Number(product?.price || 0) * (oi._sum.quantity || 0),
					image: product?.images?.[0],
				};
			});
		},
		["dashboard-most-purchased"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

async function getLowStockProducts(
	limit = 10,
	threshold = 10,
): Promise<LowStockProduct[]> {
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				where: {
					inventory: { lte: threshold, gt: 0 },
				},
				orderBy: { inventory: "asc" },
				take: limit,
				select: { id: true, name: true, inventory: true, images: true },
			});
			return products.map((p) => ({
				...p,
				image: p.images?.[0],
			}));
		},
		["dashboard-low-stock"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

async function getNeverPurchasedProducts(
	limit = 10,
): Promise<NeverPurchasedProduct[]> {
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				where: {
					orderItems: { none: {} },
				},
				orderBy: { id: "asc" },
				take: limit,
				select: {
					id: true,
					name: true,
					inventory: true,
					images: true,
				},
			});
			return products.map((p) => ({
				...p,
				image: p.images?.[0],
			}));
		},
		["dashboard-never-purchased"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

async function getRevenueByMonth(months = 12): Promise<RevenueByMonth[]> {
	return unstable_cache(
		async () => {
			const startDate = new Date();
			startDate.setMonth(startDate.getMonth() - months + 1);
			startDate.setDate(1);
			startDate.setHours(0, 0, 0, 0);

			const orders = await prisma.order.findMany({
				where: {
					orderDate: { gte: startDate },
					orderStatus: { not: "CANCELLED" },
				},
				select: { orderDate: true, totalPrice: true },
			});

			const monthlyData = new Map<
				string,
				{ revenue: number; orders: number }
			>();

			for (const order of orders) {
				const monthKey = order.orderDate.toISOString().slice(0, 7);
				const existing = monthlyData.get(monthKey) || { revenue: 0, orders: 0 };
				existing.revenue += Number(order.totalPrice);
				existing.orders += 1;
				monthlyData.set(monthKey, existing);
			}

			const result: RevenueByMonth[] = [];
			for (let i = 0; i < months; i++) {
				const date = new Date();
				date.setMonth(date.getMonth() - months + 1 + i);
				const monthKey = date.toISOString().slice(0, 7);
				const data = monthlyData.get(monthKey) || { revenue: 0, orders: 0 };
				result.push({
					month: date.toLocaleString("default", {
						month: "short",
						year: "2-digit",
					}),
					revenue: data.revenue,
					orders: data.orders,
				});
			}

			return result;
		},
		["dashboard-revenue-by-month"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

async function getOrdersByStatus(): Promise<OrdersByStatus[]> {
	return unstable_cache(
		async () => {
			const statuses = await prisma.order.groupBy({
				by: ["orderStatus"],
				_count: { id: true },
			});
			return statuses.map((s) => ({
				status: s.orderStatus,
				count: s._count.id,
			}));
		},
		["dashboard-orders-by-status"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

async function getTopCategories(limit = 5): Promise<TopCategory[]> {
	return unstable_cache(
		async () => {
			const categories = await prisma.category.findMany({
				include: {
					products: {
						include: {
							orderItems: {
								select: {
									quantity: true,
									product: { select: { price: true } },
								},
							},
						},
					},
				},
			});

			return categories
				.map((cat) => {
					let totalRevenue = 0;
					for (const product of cat.products) {
						for (const oi of product.orderItems) {
							totalRevenue += Number(product.price) * oi.quantity;
						}
					}
					return {
						id: cat.id,
						name: cat.name,
						productCount: cat.products.length,
						totalRevenue,
					};
				})
				.sort((a, b) => b.totalRevenue - a.totalRevenue)
				.slice(0, limit);
		},
		["dashboard-top-categories"],
		{ revalidate: 300, tags: ["dashboard"] },
	)();
}

export type {
	DashboardStats,
	LowStockProduct,
	MostPurchasedProduct,
	NeverPurchasedProduct,
	OrdersByStatus,
	RevenueByMonth,
	TopCategory,
	TopRatedProduct,
};
export {
	getDashboardStats,
	getLowStockProducts,
	getMostPurchasedProducts,
	getNeverPurchasedProducts,
	getOrdersByStatus,
	getRevenueByMonth,
	getTopCategories,
	getTopRatedProducts,
};
