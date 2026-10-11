"use client";

import {
	IconAlertTriangle,
	IconBox,
	IconClock,
	IconCoins,
	IconPackage,
	IconShoppingCart,
	IconStar,
	IconTrendingUp,
} from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import type * as React from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Pie,
	PieChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const COLORS_STATUS = [
	"var(--processing)",
	"var(--delivered)",
	"var(--pending)",
	"var(--shipped)",
	"var(--cancelled)",
];

interface DashboardChartsProps {
	stats: {
		totalProducts: number;
		totalOrders: number;
		totalRevenue: number;
		pendingOrders: number;
	};
	topRated: Array<{
		id: number;
		name: string;
		rating: number;
		votes: number;
		image?: string;
	}>;
	mostPurchased: Array<{
		id: number;
		name: string;
		totalQuantity: number;
		revenue: number;
		image?: string;
	}>;
	lowStock: Array<{
		id: number;
		name: string;
		inventory: number;
		image?: string;
	}>;
	neverPurchased: Array<{
		id: number;
		name: string;
		inventory: number;
		image?: string;
	}>;
	revenueByMonth: Array<{
		month: string;
		revenue: number;
		orders: number;
	}>;
	ordersByStatus: Array<{
		status: string;
		count: number;
	}>;
	topCategories: Array<{
		id: number;
		name: string;
		productCount: number;
		totalRevenue: number;
	}>;
}

export default function DashboardCharts({
	props,
}: {
	props: DashboardChartsProps;
}) {
	const {
		stats,
		topRated,
		mostPurchased,
		lowStock,
		neverPurchased,
		revenueByMonth,
		ordersByStatus,
		topCategories,
	} = props;

	return (
		<div className="p-px rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto grid  grid-cols-1 md:grid-cols-12 gap-4">
			<StatCard
				title="Total Revenue"
				value={`$${stats.totalRevenue.toLocaleString()}`}
				icon={IconCoins}
				color="orange"
				className="w-full md:col-span-6 xl:col-span-3"
			/>
			<StatCard
				title="Total Products"
				value={stats.totalProducts.toLocaleString()}
				icon={IconPackage}
				color="blue"
				className="w-full md:col-span-6 xl:col-span-3"
			/>
			<StatCard
				title="Total Orders"
				value={stats.totalOrders.toLocaleString()}
				icon={IconShoppingCart}
				color="green"
				className="w-full md:col-span-6 xl:col-span-3"
			/>
			<StatCard
				title="Pending Orders"
				value={stats.pendingOrders.toLocaleString()}
				icon={IconClock}
				color="yellow"
				className="w-full md:col-span-6 xl:col-span-3"
			/>

			<OrdersStatusChart
				data={ordersByStatus}
				className="w-full md:col-span-12 lg:col-span-5"
			/>
			<MostPurchasedChart
				data={mostPurchased}
				className="w-full md:col-span-12 lg:col-span-7"
			/>
			<RevenueChart data={revenueByMonth} className="w-full md:col-span-12" />
			<LowStockChart
				data={lowStock}
				className="w-full md:col-span-12 lg:col-span-6"
			/>
			<TopCategoriesChart
				data={topCategories}
				className="w-full md:col-span-12 lg:col-span-6"
			/>
			<TopRatedChart
				data={topRated}
				className="w-full md:col-span-12 lg:col-span-6"
			/>
			<NeverPurchasedChart
				data={neverPurchased}
				className="w-full md:col-span-12 lg:col-span-6"
			/>
		</div>
	);
}

function StatCard({
	title,
	value,
	icon: Icon,
	color,
	className,
}: {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	className?: string;
}) {
	return (
		<Card className={className}>
			<CardContent>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-base font-semibold text-muted-foreground">
							{title}
						</p>
						<p className="text-2xl font-bold">{value}</p>
					</div>
					<div
						className={clsx("p-3 rounded-lg", {
							"text-orange-500": color === "orange",
							"text-cyan-500": color === "blue",
							"text-green-500": color === "green",
							"text-yellow-500": color === "yellow",
						})}
					>
						<Icon className="h-6 w-6" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function OrdersStatusChart({
	data,
	className,
}: {
	data: DashboardChartsProps["ordersByStatus"];
	className?: string;
}) {
	const chartData = data.map((item, index) => ({
		...item,
		fill: COLORS_STATUS[index % COLORS_STATUS.length],
	}));

	const chartConfig = Object.fromEntries(
		chartData.map((item) => [
			item.status,
			{ label: item.status, color: item.fill },
		]),
	);

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconPackage className="h-4 w-4 text-primary" />
					Orders by Status
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="lg:aspect-square">
					<PieChart>
						<Pie
							data={chartData}
							innerRadius={"45%"}
							outerRadius={"75%"}
							paddingAngle={2}
							isAnimationActive
							animationDuration={800}
							dataKey="count"
							nameKey="status"
							label={({ percent }: { name?: string; percent?: number }) =>
								`${((percent ?? 0) * 100).toFixed(0)}%`
							}
							labelLine
						/>
						<Tooltip
							content={
								<ChartTooltipContent
									formatter={(value: unknown) => {
										const num = typeof value === "number" ? value : 0;
										return [num.toLocaleString(), " Orders"];
									}}
									nameKey="status"
								/>
							}
						/>
						<Legend verticalAlign="bottom" height={36} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function MostPurchasedChart({
	data,
	className,
}: {
	data: DashboardChartsProps["mostPurchased"];
	className?: string;
}) {
	const chartData = data.map((item, index) => ({
		...item,
		fill: `var(--chart-${(index % 5) + 1})`,
	}));

	const chartConfig = {
		quantity: { label: "Quantity Sold" },
		...Object.fromEntries(
			chartData.map((item) => [
				item.name,
				{ label: item.name, color: item.fill },
			]),
		),
	};

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconShoppingCart className="h-4 w-4 text-primary" />
					Most Purchased Products
				</CardTitle>
			</CardHeader>
			<CardContent className="lg:pt-6">
				<ChartContainer config={chartConfig}>
					<BarChart data={chartData} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis
							type="number"
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<YAxis
							type="category"
							dataKey="name"
							width={100}
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<Tooltip
							content={
								<ChartTooltipContent
									formatter={(value: unknown) => {
										const num = typeof value === "number" ? value : 0;
										return [num.toLocaleString(), " Units Sold"];
									}}
									labelFormatter={(label) => label}
								/>
							}
						/>
						<Bar
							dataKey="totalQuantity"
							radius={[0, 6, 6, 0]}
							isAnimationActive
							animationDuration={800}
							maxBarSize={40}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function RevenueChart({
	data,
	className,
}: {
	data: DashboardChartsProps["revenueByMonth"];
	className?: string;
}) {
	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconCoins className="h-4 w-4 text-primary" />
					Revenue (Last 12 Months)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className="w-full max-h-140"
					config={{
						revenue: { label: "Revenue", color: "var(--chart-1)" },
						orders: { label: "Orders", color: "var(--chart-3)" },
					}}
				>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--chart-1)"
									stopOpacity={0.6}
								/>
								<stop
									offset="95%"
									stopColor="var(--chart-3)"
									stopOpacity={0.05}
								/>
							</linearGradient>
							<linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--chart-2)"
									stopOpacity={0.5}
								/>
								<stop
									offset="95%"
									stopColor="var(--chart-4)"
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							className="stroke-border/50"
						/>
						<XAxis
							dataKey="month"
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
							tickFormatter={(value) => `${(value).toFixed(0)} DT`}
						/>
						<Tooltip
							content={
								<ChartTooltipContent
									formatter={(value: unknown) => {
										const num = typeof value === "number" ? value : 0;
										return ["Revenue: ", `${num.toLocaleString()} DT`];
									}}
									indicator="dot"
								/>
							}
							cursor={false}
						/>
						<Legend />
						<Area
							type="monotone"
							dataKey="revenue"
							fill="url(#fillRevenue)"
							stroke="var(--chart-2)"
							strokeWidth={2}
							isAnimationActive
							animationDuration={800}
							dot={false}
						/>
						<Area
							type="monotone"
							dataKey="orders"
							fill="url(#fillOrders)"
							stroke="var(--chart-5)"
							strokeWidth={2}
							dot={false}
							isAnimationActive
							animationDuration={800}
							yAxisId="right"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function TopRatedChart({
	data,
	className,
}: {
	data: DashboardChartsProps["topRated"];
	className?: string;
}) {
	const chartData = data.map((item, index) => ({
		...item,
		fill: `var(--chart-${(index % 5) + 1})`,
	}));

	const chartConfig = {
		rating: { label: "Rating" },
		...Object.fromEntries(
			chartData.map((item) => [
				item.name,
				{ label: item.name, color: item.fill },
			]),
		),
	};

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconStar className="h-4 w-4 text-amber-500" />
					Top Rated Products
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart data={chartData} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis
							type="number"
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<YAxis
							type="category"
							dataKey="name"
							width={100}
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<Tooltip
							content={
								<ChartTooltipContent
									formatter={(value: unknown) => {
										const num = typeof value === "number" ? value : 0;
										return [num.toFixed(1), " Rating"];
									}}
									labelFormatter={(label) => label}
								/>
							}
						/>
						<Bar
							dataKey="rating"
							radius={[0, 6, 6, 0]}
							isAnimationActive
							animationDuration={800}
							maxBarSize={40}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function LowStockChart({
	data,
	className,
}: {
	data: DashboardChartsProps["lowStock"];
	className?: string;
}) {
	const chartData = data.map((item, index) => ({
		...item,
		fill: `var(--chart-${(index % 5) + 1})`,
	}));

	const chartConfig = {
		inventory: { label: "Inventory" },
		...Object.fromEntries(
			chartData.map((item) => [
				item.name,
				{ label: item.name, color: item.fill },
			]),
		),
	};

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconAlertTriangle className="h-4 w-4 text-destructive" />
					Low Stock Products
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart data={chartData} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis
							type="number"
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<YAxis
							type="category"
							dataKey="name"
							width={120}
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<Tooltip
							content={
								<ChartTooltipContent
									formatter={(value: unknown) => {
										const num = typeof value === "number" ? value : 0;
										return [num.toLocaleString(), " Units Left"];
									}}
									labelFormatter={(label) => label}
								/>
							}
						/>
						<Bar
							dataKey="inventory"
							radius={[0, 6, 6, 0]}
							isAnimationActive
							animationDuration={800}
							maxBarSize={40}
							fill="var(--muted-foreground)"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function TopCategoriesChart({
	data,
	className,
}: {
	data: DashboardChartsProps["topCategories"];
	className?: string;
}) {
	const chartData = data.map((item, index) => ({
		...item,
		fill: `var(--chart-${(index % 5) + 1})`,
	}));

	const chartConfig = {
		revenue: { label: "Revenue" },
		...Object.fromEntries(
			chartData.map((item) => [
				item.name,
				{ label: item.name, color: item.fill },
			]),
		),
	};

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconTrendingUp className="h-4 w-4 text-primary" />
					Top Categories by Revenue
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart data={chartData} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis
							type="number"
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
							tickFormatter={(value) => `${(value).toFixed(0)} DT`}
						/>
						<YAxis
							type="category"
							dataKey="name"
							width={100}
							className="text-xs"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<Tooltip
							content={
								<ChartTooltipContent
									formatter={(value: unknown) => {
										const num = typeof value === "number" ? value : 0;
										return ["Revenue: ", `${num.toLocaleString()} DT`];
									}}
									labelFormatter={(label) => label}
								/>
							}
						/>
						<Bar
							dataKey="totalRevenue"
							radius={[0, 6, 6, 0]}
							isAnimationActive
							animationDuration={800}
							maxBarSize={40}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function NeverPurchasedChart({
	data,
	className,
}: {
	data: DashboardChartsProps["neverPurchased"];
	className?: string;
}) {
	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<IconBox className="h-4 w-4 text-primary" />
					Never Purchased Products
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="text-center text-muted-foreground py-8">
						All products have been purchased!
					</p>
				) : (
					<div className="space-y-3 max-h-60 overflow-y-auto">
						{data.map((product) => (
							<div
								key={product.id}
								className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
							>
								{product.image && (
									<Image
										src={product.image}
										alt={product.name}
										width={48}
										height={48}
										className="w-12 h-12 rounded-lg object-cover"
									/>
								)}
								<div className="flex-1 min-w-0">
									<p className="font-medium text-sm truncate">{product.name}</p>
									<p className="text-xs text-muted-foreground">
										Inventory: {product.inventory}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
