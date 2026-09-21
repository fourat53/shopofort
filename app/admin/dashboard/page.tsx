import DashboardCharts from "@/components/cards/DashboardCharts";

async function getDashboardData() {
	const [
		{ getDashboardStats },
		{ getTopRatedProducts },
		{ getMostPurchasedProducts },
		{ getLowStockProducts },
		{ getNeverPurchasedProducts },
		{ getRevenueByMonth },
		{ getOrdersByStatus },
		{ getTopCategories },
	] = await Promise.all([
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
		import("@/actions/DashboardActions"),
	]);

	const [
		stats,
		topRated,
		mostPurchased,
		lowStock,
		neverPurchased,
		revenueByMonth,
		ordersByStatus,
		topCategories,
	] = await Promise.all([
		getDashboardStats(),
		getTopRatedProducts(5),
		getMostPurchasedProducts(5),
		getLowStockProducts(10),
		getNeverPurchasedProducts(10),
		getRevenueByMonth(12),
		getOrdersByStatus(),
		getTopCategories(5),
	]);

	return {
		stats,
		topRated,
		mostPurchased,
		lowStock,
		neverPurchased,
		revenueByMonth,
		ordersByStatus,
		topCategories,
	};
}

export default async function DashboardPage() {
	const data = await getDashboardData();

	return <DashboardCharts props={data} />;
}
