import {
	IconHeart,
	IconMinus,
	IconPlus,
	IconShoppingBag,
	IconStarFilled,
	IconTruck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductColor, ProductSize } from "@/lib/entity/types";
import { cn } from "@/lib/utils";

export default function ProductInfo({ product }: { product: Product }) {
	const price = Number(product.price);
	const rating = Number(product.rating);
	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center">
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
			</div>
			<div className="mt-7 flex justify-between items-center">
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

			<Separator className="my-4" />

			{/* Colors */}
			{product.colors?.length > 0 && <ProductColors colors={product.colors} />}

			<Separator className="my-4" />

			{/* Sizes */}
			{product.sizes?.length > 0 && <ProductSizes sizes={product.sizes} />}

			<Separator className="my-4" />

			{/* Description */}
			<div>
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Description
				</h2>

				<p className="leading-7 text-muted-foreground">
					{product.description || "No description available for this product."}
				</p>
			</div>

			{/* Actions */}
			<ProductActions product={product} />
		</div>
	);
}

function ProductColors({ colors }: { colors: ProductColor[] }) {
	return (
		<div className="mb-4">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Color
				</h2>

				<span className="text-xs text-muted-foreground">
					{colors.length} available
				</span>
			</div>

			<div className="flex flex-wrap gap-2">
				{colors.map((color) => (
					<Button
						key={color}
						type="button"
						variant="outline"
						className="rounded-xl px-4"
					>
						<span
							className={cn(
								"size-3 rounded-full border",
								color === "Black" && "bg-black",
								color === "White" && "bg-white",
								color === "Gray" && "bg-gray-400",
								color === "Red" && "bg-red-500",
								color === "Green" && "bg-green-500",
								color === "Blue" && "bg-blue-500",
								color === "Yellow" && "bg-yellow-400",
								color === "Purple" && "bg-purple-500",
								color === "Orange" && "bg-orange-500",
								color === "Pink" && "bg-pink-500",
							)}
						/>
						{color}
					</Button>
				))}
			</div>
		</div>
	);
}

function ProductSizes({ sizes }: { sizes: ProductSize[] }) {
	return (
		<div className="mb-2">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-sm font-semibold uppercase tracking-wider">Size</h2>

				<button
					type="button"
					className="text-xs font-medium text-primary hover:underline"
				>
					Size guide
				</button>
			</div>

			<div className="flex flex-wrap gap-2">
				{sizes.map((size) => (
					<Button
						key={size}
						type="button"
						variant="outline"
						className="size-10 rounded-xl px-0"
					>
						{size}
					</Button>
				))}
			</div>
		</div>
	);
}

function ProductActions({ product }: { product: Product }) {
	const inventory = Number(product.inventory);
	return (
		<>
			{/* Stock */}
			<div className="mt-8 rounded-2xl border bg-muted/30 p-4">
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
			<div className="mt-8 flex gap-3">
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
		</>
	);
}
