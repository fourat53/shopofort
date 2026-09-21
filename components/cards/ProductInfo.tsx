"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
	IconMinus,
	IconPlus,
	IconShoppingBag,
	IconStarFilled,
	IconTruck,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { createCartItem } from "@/actions/CartItemActions";
import { updateProductRating } from "@/actions/ProductActions";
import { PagesTitle } from "@/app/(client)/layout";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductColor, ProductSize } from "@/lib/entity/types";
import { ColorCell, SizeCell } from "../data-table/table-cells/SpecialCells";

export default function ProductInfo({
	product,
	userRating: initialUserRating,
}: {
	product: Product;
	userRating?: number;
}) {
	const price = Number(product.price);
	const rating = Number(product.rating);
	const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
	const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
	const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
	const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
	const [userRating, setUserRating] = useState<number>(initialUserRating || 0);
	const [quantity, setQuantity] = useState<number>(1);

	const { getUser, isAuthenticated } = useKindeBrowserClient();

	const handleAddToCart = async () => {
		if (!selectedColor) {
			toast.error("Please select a color");
			return;
		}
		if (!selectedSize) {
			toast.error("Please select a size");
			return;
		}

		if (!isAuthenticated) {
			toast.error("Please sign in to add items to cart");
			return;
		}

		setIsAddingToCart(true);
		try {
			const user = await getUser();

			if (!user) {
				toast.error("Please sign in to add items to cart");
				return;
			}

			const formData = new FormData();
			formData.append("productId", product.id.toString());
			formData.append("quantity", quantity.toString());
			formData.append("color", selectedColor);
			formData.append("size", selectedSize);
			formData.append("userId", user.id);

			await createCartItem(formData);
			toast.success("Added to cart!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to add to cart");
		} finally {
			setIsAddingToCart(false);
		}
	};

	const handleRatingSubmit = async (stars: number) => {
		setIsSubmittingRating(true);
		try {
			const user = await getUser();
			if (!user) {
				toast.error("Please sign in to rate");
				return;
			}
			await updateProductRating(user.id, product.id, stars);
			setUserRating(stars);
			toast.success("Thanks for your rating!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to submit rating");
		} finally {
			setIsSubmittingRating(false);
		}
	};

	const incrementQuantity = () => {
		if (quantity < product.inventory) {
			setQuantity((q) => q + 1);
		}
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity((q) => q - 1);
		}
	};

	const inventory = Number(product.inventory);
	const isOutOfStock = inventory === 0;

	return (
		<div className="flex flex-col">
			<PagesTitle className="sm:mb-4">{product.name}</PagesTitle>

			{product.brand && (
				<p className="text-2xl font-bold text-muted-foreground">
					<span className="uppercase tracking-[0.18em]"> {product.brand}</span>
				</p>
			)}
			<div className="py-4 flex justify-between items-center">
				<div className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">
					{price.toFixed(2)} DT
				</div>

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

			{product.colors?.length > 0 && (
				<ProductColors
					colors={product.colors}
					selectedColor={selectedColor}
					onSelectColor={setSelectedColor}
				/>
			)}

			<Separator />

			{product.sizes?.length > 0 && (
				<ProductSizes
					sizes={product.sizes}
					selectedSize={selectedSize}
					onSelectSize={setSelectedSize}
				/>
			)}

			<Separator />

			<ProductRating
				currentRating={rating}
				votes={product.votes}
				userRating={userRating}
				onRate={handleRatingSubmit}
				isSubmitting={isSubmittingRating}
			/>

			<Separator />

			<div className="py-4">
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Description
				</h2>

				<p className="leading-7 text-muted-foreground">
					{product.description || "No description available for this product."}
				</p>
			</div>

			<Separator />

			<ProductActions
				product={product}
				quantity={quantity}
				onIncrement={incrementQuantity}
				onDecrement={decrementQuantity}
				onAddToCart={handleAddToCart}
				isAddingToCart={isAddingToCart}
				isOutOfStock={isOutOfStock}
				hasSelections={!!selectedColor && !!selectedSize}
			/>
		</div>
	);
}

function ProductColors({
	colors,
	selectedColor,
	onSelectColor,
}: {
	colors: ProductColor[];
	selectedColor: ProductColor | null;
	onSelectColor: (color: ProductColor) => void;
}) {
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
				{colors.map((color, index) => (
					<ColorCell
						key={index}
						value={color}
						className={clsx(
							"text-sm h-6 px-2 cursor-pointer transition-all border-2 border-transparent",
							"hover:border-primary/50 hover:opacity-70 dark:hover:opacity-80",
							selectedColor === color && "border-primary text-primary",
						)}
						onClick={() => onSelectColor(color)}
					/>
				))}
			</div>
		</div>
	);
}

function ProductSizes({
	sizes,
	selectedSize,
	onSelectSize,
}: {
	sizes: ProductSize[];
	selectedSize: ProductSize | null;
	onSelectSize: (size: ProductSize) => void;
}) {
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
					<SizeCell
						key={size}
						value={size}
						onClick={() => onSelectSize(size)}
						className={clsx(
							"h-7 px-2 text-sm cursor-pointer rounded-md border-2 border-transparent",
							"hover:border-primary/50 hover:opacity-70 dark:hover:opacity-80",
							selectedSize === size && "border-primary text-primary",
						)}
					/>
				))}
			</div>
		</div>
	);
}

function ProductRating({
	currentRating,
	votes,
	userRating,
	onRate,
	isSubmitting,
}: {
	currentRating: number;
	votes: number;
	userRating: number;
	onRate: (stars: number) => void;
	isSubmitting: boolean;
}) {
	return (
		<div className="py-4">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-sm font-semibold uppercase tracking-wider">
					Your Rating
				</h2>
				{userRating > 0 && (
					<span className="text-xs text-muted-foreground">
						You rated: {userRating} star{userRating !== 1 ? "s" : ""}
					</span>
				)}
			</div>
			<Rating
				rating={userRating}
				maxRating={5}
				size="lg"
				editable={!isSubmitting}
				onRatingChange={onRate}
				showValue
				className="gap-2"
			/>
			{isSubmitting && (
				<div className="mt-2 text-sm text-muted-foreground">Submitting...</div>
			)}
			<p className="mt-2 text-xs text-muted-foreground">
				Based on {votes} {votes === 1 ? "review" : "reviews"} ·{" "}
				{currentRating.toFixed(1)}/5 overall
			</p>
		</div>
	);
}

function ProductActions({
	product,
	quantity,
	onIncrement,
	onDecrement,
	onAddToCart,
	isAddingToCart,
	isOutOfStock,
	hasSelections,
}: {
	product: Product;
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
	onAddToCart: () => void;
	isAddingToCart: boolean;
	isOutOfStock: boolean;
	hasSelections: boolean;
}) {
	const inventory = Number(product.inventory);

	return (
		<div className="py-4 space-y-4">
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
				<div className="flex h-11 items-center rounded-xl border bg-card">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-10 rounded-xl"
						disabled={Boolean(inventory === 0)}
						onClick={onDecrement}
					>
						<IconMinus className="size-4" />
					</Button>
					<span className="min-w-8 text-center text-sm font-semibold">
						{quantity}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-10 rounded-xl"
						disabled={Boolean(inventory === 0 || quantity >= inventory)}
						onClick={onIncrement}
					>
						<IconPlus className="size-4" />
					</Button>
				</div>

				<Button
					className="h-11 px-0 flex-1 rounded-xl text-sm font-semibold shadow-md shadow-primary/10"
					disabled={Boolean(isOutOfStock || !hasSelections || isAddingToCart)}
					loading={isAddingToCart}
					onClick={onAddToCart}
				>
					<IconShoppingBag className="size-4.5" />
					{isAddingToCart ? "Adding..." : "Add to Cart"}
				</Button>
			</div>
		</div>
	);
}
