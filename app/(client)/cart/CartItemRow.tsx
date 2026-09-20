"use client";

import {
	IconMinus,
	IconPlus,
	IconShoppingCart,
	IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import {
	deleteCartItem,
	updateCartItemQuantity,
} from "@/actions/CartItemActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/functions/client";

interface CartItemRowProps {
	item: {
		id: number;
		quantity: number;
		color: string | null;
		size: string | null;
		product: {
			id: number;
			name: string;
			brand: string | null;
			price: number;
			images: string[];
			inventory: number;
		};
	};
}

export function CartItemRow({ item }: CartItemRowProps) {
	const product = item.product;
	const price = Number(product.price);
	const totalPrice = price * item.quantity;
	const maxQuantity = product.inventory;

	return (
		<tr className="border-b border-border/50">
			<td className="p-4">
				<div className="flex gap-4 items-center">
					<div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
						{product.images?.[0] ? (
							<Image
								src={product.images[0]}
								alt={product.name}
								fill
								sizes="80px"
								className="object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
								No image
								<IconShoppingCart className="size-8" />
							</div>
						)}
					</div>
					<div>
						<a
							href={`/products/${product.id}`}
							className="font-medium text-lg hover:text-primary transition-colors"
						>
							{product.name}
						</a>
						<p className="text-sm text-muted-foreground mt-0.5">
							{product.brand}
						</p>
						<div className="flex gap-2 mt-1 text-sm text-muted-foreground">
							{item.color && (
								<span className="flex items-center gap-1">
									<span
										className="w-3 h-3 rounded-full border"
										style={{ backgroundColor: item.color.toLowerCase() }}
									/>
									{item.color}
								</span>
							)}
							{item.size && (
								<span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">
									{item.size}
								</span>
							)}
						</div>
					</div>
				</div>
			</td>
			<td className="p-4 text-right">
				<p className="font-medium">{formatCurrency(price)}</p>
			</td>
			<td className="p-4 text-right">
				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() =>
							updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))
						}
						disabled={item.quantity <= 1}
					>
						<IconMinus className="size-4" />
					</Button>
					<Input
						type="number"
						value={item.quantity}
						min={1}
						max={maxQuantity}
						className="w-16 text-center"
						onChange={(e) =>
							updateCartItemQuantity(
								item.id,
								Math.min(
									maxQuantity,
									Math.max(1, parseInt(e.target.value, 10) || 1),
								),
							)
						}
					/>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() =>
							updateCartItemQuantity(
								item.id,
								Math.min(maxQuantity, item.quantity + 1),
							)
						}
						disabled={item.quantity >= maxQuantity}
					>
						<IconPlus className="size-4" />
					</Button>
				</div>
				{maxQuantity < 10 && (
					<p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
						Only {maxQuantity} left in stock
					</p>
				)}
			</td>
			<td className="p-4 text-right font-medium">
				{formatCurrency(totalPrice)}
			</td>
			<td className="p-4 text-right">
				<Button
					variant="ghost"
					size="icon"
					className="text-destructive hover:bg-destructive/10"
					onClick={() => deleteCartItem(item.id)}
				>
					<IconTrash className="size-4" />
				</Button>
			</td>
		</tr>
	);
}
