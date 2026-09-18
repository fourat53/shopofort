import {
	IconHeart,
	IconMinus,
	IconPlus,
	IconShoppingBag,
	IconStarFilled,
	IconTruck,
} from "@tabler/icons-react";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductColor, ProductSize } from "@/lib/entity/types";

export default function ProductInfo({ product }: { product: Product }) {
	const price = Number(product.price);
	const rating = Number(product.rating);
	return (
		<div className="flex flex-col">
			{/* Name */}
			<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
				{product.name}
			</h1>

			{/* Brand */}
			{product.brand && (
				<p className="text-lg font-bold uppercase tracking-[0.18em] text-muted-foreground">
					{product.brand}
				</p>
			)}
			<div className="py-4 flex justify-between items-center">
				{/* Price */}
				<div className="flex items-end gap-3">
					<span className="text-4xl font-bold tracking-tight text-primary">
						${price.toFixed(2)}
					</span>
				</div>

				{/* Rating */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1">
						<IconStarFilled className="size-5 text-amber-500" />
						<span className="font-semibold">{rating.toFixed(1)}</span>
					</div>

					<Separator orientation="vertical" className="h-5" />

					<span className="text-sm text-muted-foreground">
						{product.votes} {product.votes === 1 ? "review" : "reviews"}
					</span>
				</div>
			</div>

			<Separator />

			{/* Colors */}
			{product.colors?.length > 0 && <ProductColors colors={product.colors} />}

			<Separator />

			{/* Sizes */}
			{product.sizes?.length > 0 && <ProductSizes sizes={product.sizes} />}

			<Separator />

			{/* Description */}
			<div className="py-4">
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Description
				</h2>

				<p className="leading-7 text-muted-foreground">
					{product.description || "No description available for this product."}
				</p>
			</div>

			<Separator />

			{/* Actions */}
			<ProductActions product={product} />
		</div>
	);
}

function ProductColors({ colors }: { colors: ProductColor[] }) {
	return (
		<div className="py-4">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Colors
				</h2>

				<span className="text-xs text-muted-foreground">
					{colors.length} available
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{colors.map((item, index) => (
					<Badge
						key={index}
						className={clsx(
							"text-sm h-6 px-2 cursor-pointer hover:opacity-70 dark:hover:opacity-80",
							item === "Red" &&
								"bg-red-200/50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
							item === "Green" &&
								"bg-green-200/50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
							item === "Blue" &&
								"bg-blue-200/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
							item === "Yellow" &&
								"bg-yellow-200/50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
							item === "Purple" &&
								"bg-purple-200/50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
							item === "Orange" &&
								"bg-orange-200/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
							item === "Pink" &&
								"bg-pink-200/50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
							item === "White" &&
								"bg-zinc-300/30 dark:bg-zinc-700/80 text-zinc-500/75 dark:text-zinc-200",
							item === "Gray" &&
								"bg-zinc-300/50 dark:bg-zinc-700/40 text-zinc-500 dark:text-zinc-400",
							item === "Black" &&
								"bg-zinc-300/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-400/75",
						)}
					>
						{item}
					</Badge>
				))}
			</div>
		</div>
	);
}

function ProductSizes({ sizes }: { sizes: ProductSize[] }) {
	return (
		<div className="py-4">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Sizes
				</h2>

				<button
					type="button"
					className="text-xs font-medium text-primary hover:underline"
				>
					Size guide
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{sizes.map((size) => (
					<Badge
						key={size}
						className="text-sm bg-muted h-6 w-10 px-2 cursor-pointer hover:opacity-70 dark:hover:opacity-80"
					>
						{size}
					</Badge>
				))}
			</div>
		</div>
	);
}

function ProductActions({ product }: { product: Product }) {
	const inventory = Number(product.inventory);
	return (
		<div className="py-4 space-y-4">
			{/* Stock */}
			<div className="rounded-2xl border bg-muted/30 p-4">
				<div className="flex items-center gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
						<IconTruck className="size-4.5" />
					</div>

					<div>
						<p className="text-sm font-semibold">
							{product.inventory > 0
								? "Ready to ship"
								: "Currently unavailable"}
						</p>

						<p className="text-xs text-muted-foreground">
							{product.inventory > 0
								? "Fast delivery available"
								: "Check back later for availability"}
						</p>
					</div>
				</div>
			</div>
			<div className="flex gap-3">
				<div className="flex h-12 items-center rounded-xl border bg-card">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-12 rounded-xl"
						disabled={inventory === 0}
					>
						<IconMinus className="size-4" />
					</Button>
					<span className="min-w-8 text-center text-sm font-semibold">1</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-11 rounded-xl"
						disabled={inventory === 0}
					>
						<IconPlus className="size-4" />
					</Button>
				</div>

				<Button
					className="h-11 flex-1 rounded-xl text-sm font-semibold shadow-md shadow-primary/10"
					disabled={inventory === 0}
				>
					<IconShoppingBag className="size-4.5" />
					{inventory === 0 ? "Out of Stock" : "Add to Cart"}
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-11 shrink-0 rounded-xl"
					disabled={inventory === 0}
				>
					<IconHeart className="size-5" />
				</Button>
			</div>
		</div>
	);
}
